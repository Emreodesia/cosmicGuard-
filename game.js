class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.gameRunning = false;
        this.gameOver = false;
        
        // Game objects
        this.player = new Player(this.canvas);
        this.bullets = [];
        this.enemies = [];
        this.particles = [];
        
        // Game state
        this.score = 0;
        this.level = 1;
        this.enemySpawnRate = 2000; // milliseconds
        this.lastEnemySpawn = 0;
        this.difficultyIncrease = 30000; // every 30 seconds
        this.lastDifficultyIncrease = 0;
        
        // Timing
        this.lastTime = 0;
        this.deltaTime = 0;
        
        // UI elements
        this.startScreen = document.getElementById('startScreen');
        this.gameOverScreen = document.getElementById('gameOver');
        this.scoreElement = document.getElementById('score');
        this.levelElement = document.getElementById('level');
        this.healthFill = document.querySelector('.health-fill');
        
        this.setupEventListeners();
        this.setupBackground();
    }
    
    setupEventListeners() {
        // Start button
        document.getElementById('startButton').addEventListener('click', () => {
            this.startGame();
        });
        
        // Restart with R key
        document.addEventListener('keydown', (e) => {
            if (e.code === 'KeyR' && this.gameOver) {
                this.restartGame();
            }
        });
        
        // Shooting
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && this.gameRunning && !this.gameOver) {
                e.preventDefault();
                this.playerShoot();
            }
        });
    }
    
    setupBackground() {
        // Create starfield background
        this.stars = [];
        for (let i = 0; i < 100; i++) {
            this.stars.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 2 + 1,
                speed: Math.random() * 0.5 + 0.1
            });
        }
    }
    
    startGame() {
        this.gameRunning = true;
        this.gameOver = false;
        this.startScreen.style.display = 'none';
        this.gameOverScreen.style.display = 'none';
        
        // Reset game state
        this.score = 0;
        this.level = 1;
        this.enemySpawnRate = 2000;
        this.lastDifficultyIncrease = Date.now();
        
        // Clear arrays
        this.bullets = [];
        this.enemies = [];
        this.particles = [];
        
        // Reset player
        this.player.reset();
        
        // Start game loop
        this.gameLoop();
    }
    
    restartGame() {
        this.startGame();
    }
    
    gameLoop(currentTime = 0) {
        if (!this.gameRunning) return;
        
        this.deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;
        
        this.update();
        this.draw();
        
        requestAnimationFrame((time) => this.gameLoop(time));
    }
    
    update() {
        if (this.gameOver) return;
        
        // Update player
        this.player.update(this.deltaTime);
        
        // Update bullets
        this.updateBullets();
        
        // Update enemies
        this.updateEnemies();
        
        // Update particles
        this.updateParticles();
        
        // Spawn enemies
        this.spawnEnemies();
        
        // Check collisions
        this.checkCollisions();
        
        // Update difficulty
        this.updateDifficulty();
        
        // Update UI
        this.updateUI();
        
        // Check game over
        if (!this.player.isAlive) {
            this.endGame();
        }
    }
    
    updateBullets() {
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            const bullet = this.bullets[i];
            bullet.update(this.deltaTime);
            
            if (!bullet.isAlive) {
                this.bullets.splice(i, 1);
            }
        }
    }
    
    updateEnemies() {
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const enemy = this.enemies[i];
            enemy.update(this.deltaTime);
            enemy.updateExplosion();
            
            if (!enemy.isAlive) {
                this.enemies.splice(i, 1);
            }
        }
    }
    
    updateParticles() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.life--;
            
            if (particle.life <= 0) {
                this.particles.splice(i, 1);
            }
        }
    }
    
    spawnEnemies() {
        const currentTime = Date.now();
        if (currentTime - this.lastEnemySpawn > this.enemySpawnRate) {
            this.lastEnemySpawn = currentTime;
            
            // Randomly choose enemy type
            const enemyType = Math.random() < 0.7 ? 'asteroid' : 'alien';
            this.enemies.push(new Enemy(this.canvas, enemyType));
        }
    }
    
    updateDifficulty() {
        const currentTime = Date.now();
        if (currentTime - this.lastDifficultyIncrease > this.difficultyIncrease) {
            this.lastDifficultyIncrease = currentTime;
            this.level++;
            
            // Increase difficulty
            this.enemySpawnRate = Math.max(500, this.enemySpawnRate - 200);
            
            // Upgrade player weapon every 3 levels
            if (this.level % 3 === 0) {
                this.player.upgradeWeapon();
            }
        }
    }
    
    checkCollisions() {
        // Bullet vs Enemy collisions
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            const bullet = this.bullets[i];
            
            for (let j = this.enemies.length - 1; j >= 0; j--) {
                const enemy = this.enemies[j];
                
                if (bullet.checkCollision(enemy)) {
                    // Enemy takes damage
                    const destroyed = enemy.takeDamage(bullet.damage);
                    
                    if (destroyed) {
                        this.score += enemy.score;
                        this.createScorePopup(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, enemy.score);
                    }
                    
                    // Destroy bullet
                    bullet.destroy();
                    break;
                }
            }
        }
        
        // Player vs Enemy collisions
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const enemy = this.enemies[i];
            
            if (enemy.checkCollision(this.player)) {
                this.player.takeDamage(enemy.damage);
                enemy.isAlive = false;
                
                // Create impact particles
                this.createImpactParticles(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2);
            }
        }
    }
    
    createScorePopup(x, y, score) {
        this.particles.push({
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * 2,
            vy: -2,
            life: 60,
            text: `+${score}`,
            color: '#00FF00'
        });
    }
    
    createImpactParticles(x, y) {
        for (let i = 0; i < 8; i++) {
            this.particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 6,
                vy: (Math.random() - 0.5) * 6,
                life: 30,
                size: Math.random() * 3 + 2,
                color: '#FF4444'
            });
        }
    }
    
    playerShoot() {
        const bullets = this.player.shoot();
        if (bullets) {
            if (Array.isArray(bullets)) {
                this.bullets.push(...bullets);
            } else {
                this.bullets.push(bullets);
            }
        }
    }
    
    updateUI() {
        this.scoreElement.textContent = this.score;
        this.levelElement.textContent = this.level;
        
        // Update health bar
        const healthPercent = (this.player.health / this.player.maxHealth) * 100;
        this.healthFill.style.width = `${healthPercent}%`;
    }
    
    endGame() {
        this.gameOver = true;
        this.gameRunning = false;
        document.getElementById('finalScore').textContent = this.score;
        this.gameOverScreen.style.display = 'block';
    }
    
    draw() {
        // Clear canvas
        this.ctx.fillStyle = '#000011';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw starfield
        this.drawStarfield();
        
        // Draw game objects
        this.player.draw();
        
        // Draw bullets
        for (const bullet of this.bullets) {
            bullet.draw(this.ctx);
        }
        
        // Draw enemies
        for (const enemy of this.enemies) {
            enemy.draw();
        }
        
        // Draw particles
        this.drawParticles();
        
        // Draw UI elements
        this.drawUI();
    }
    
    drawStarfield() {
        this.ctx.fillStyle = '#FFFFFF';
        for (const star of this.stars) {
            star.y += star.speed;
            if (star.y > this.canvas.height) {
                star.y = 0;
                star.x = Math.random() * this.canvas.width;
            }
            
            this.ctx.globalAlpha = Math.random() * 0.8 + 0.2;
            this.ctx.fillRect(star.x, star.y, star.size, star.size);
        }
        this.ctx.globalAlpha = 1;
    }
    
    drawParticles() {
        for (const particle of this.particles) {
            if (particle.text) {
                // Score popup
                this.ctx.fillStyle = particle.color;
                this.ctx.font = '20px Arial';
                this.ctx.globalAlpha = particle.life / 60;
                this.ctx.fillText(particle.text, particle.x, particle.y);
            } else {
                // Impact particle
                this.ctx.fillStyle = particle.color;
                this.ctx.globalAlpha = particle.life / 30;
                this.ctx.fillRect(particle.x - particle.size/2, particle.y - particle.size/2, particle.size, particle.size);
            }
        }
        this.ctx.globalAlpha = 1;
    }
    
    drawUI() {
        // Draw weapon level indicator
        this.ctx.fillStyle = '#00FFFF';
        this.ctx.font = '16px Arial';
        this.ctx.fillText(`Weapon Level: ${this.player.weaponLevel}`, 20, 120);
        
        // Draw lives
        this.ctx.fillStyle = '#FF4444';
        for (let i = 0; i < this.player.lives; i++) {
            this.ctx.fillRect(20 + i * 25, 140, 20, 20);
        }
    }
}

// Initialize game when page loads
window.addEventListener('load', () => {
    new Game();
});
