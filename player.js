class Player {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.width = 40;
        this.height = 40;
        this.x = canvas.width / 2 - this.width / 2;
        this.y = canvas.height - this.height - 20;
        this.speed = 5;
        this.health = 100;
        this.maxHealth = 100;
        this.lives = 3;
        this.isAlive = true;
        
        // Weapon system
        this.weaponLevel = 1;
        this.fireRate = 300; // milliseconds between shots
        this.lastShot = 0;
        this.bulletSpeed = 8;
        this.bulletDamage = 25;
        
        // Movement
        this.keys = {};
        this.setupControls();
        
        // Visual effects
        this.invulnerable = false;
        this.invulnerableTime = 0;
        this.blinkInterval = 100;
        this.lastBlink = 0;
    }
    
    setupControls() {
        document.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
        });
        
        document.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });
    }
    
    update(deltaTime) {
        if (!this.isAlive) return;
        
        // Handle movement
        if (this.keys['ArrowLeft'] || this.keys['KeyA']) {
            this.x -= this.speed;
        }
        if (this.keys['ArrowRight'] || this.keys['KeyD']) {
            this.x += this.speed;
        }
        
        // Keep player within canvas bounds
        this.x = Math.max(0, Math.min(this.canvas.width - this.width, this.x));
        
        // Handle invulnerability after taking damage
        if (this.invulnerable) {
            this.invulnerableTime -= deltaTime;
            if (this.invulnerableTime <= 0) {
                this.invulnerable = false;
            }
        }
    }
    
    canShoot() {
        return Date.now() - this.lastShot >= this.fireRate;
    }
    
    shoot() {
        if (!this.canShoot() || !this.isAlive) return null;
        
        this.lastShot = Date.now();
        
        if (this.weaponLevel === 1) {
            // Single bullet
            return new Bullet(this.x + this.width / 2, this.y, this.bulletSpeed, this.bulletDamage);
        } else if (this.weaponLevel === 2) {
            // Double bullets
            return [
                new Bullet(this.x + 10, this.y, this.bulletSpeed, this.bulletDamage),
                new Bullet(this.x + this.width - 10, this.y, this.bulletSpeed, this.bulletDamage)
            ];
        } else if (this.weaponLevel >= 3) {
            // Triple bullets
            return [
                new Bullet(this.x + this.width / 2, this.y, this.bulletSpeed, this.bulletDamage),
                new Bullet(this.x + 10, this.y, this.bulletSpeed, this.bulletDamage),
                new Bullet(this.x + this.width - 10, this.y, this.bulletSpeed, this.bulletDamage)
            ];
        }
    }
    
    takeDamage(damage) {
        if (this.invulnerable) return;
        
        this.health -= damage;
        this.invulnerable = true;
        this.invulnerableTime = 1000; // 1 second invulnerability
        
        if (this.health <= 0) {
            this.lives--;
            this.health = this.maxHealth;
            
            if (this.lives <= 0) {
                this.isAlive = false;
            }
        }
    }
    
    heal(amount) {
        this.health = Math.min(this.maxHealth, this.health + amount);
    }
    
    upgradeWeapon() {
        if (this.weaponLevel < 3) {
            this.weaponLevel++;
            this.fireRate = Math.max(150, this.fireRate - 50);
            this.bulletDamage += 10;
        }
    }
    
    draw() {
        if (!this.isAlive) return;
        
        // Blink effect when invulnerable
        if (this.invulnerable) {
            const currentTime = Date.now();
            if (currentTime - this.lastBlink > this.blinkInterval) {
                this.lastBlink = currentTime;
                return; // Skip drawing this frame for blink effect
            }
        }
        
        this.ctx.save();
        
        // Draw spaceship body
        this.ctx.fillStyle = '#00ffff';
        this.ctx.beginPath();
        this.ctx.moveTo(this.x + this.width / 2, this.y);
        this.ctx.lineTo(this.x, this.y + this.height);
        this.ctx.lineTo(this.x + this.width, this.y + this.height);
        this.ctx.closePath();
        this.ctx.fill();
        
        // Draw spaceship details
        this.ctx.fillStyle = '#0088ff';
        this.ctx.fillRect(this.x + 5, this.y + 5, this.width - 10, this.height - 10);
        
        // Draw cockpit
        this.ctx.fillStyle = '#ffffff';
        this.ctx.beginPath();
        this.ctx.arc(this.x + this.width / 2, this.y + this.height / 2, 8, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Draw engine glow
        this.ctx.fillStyle = '#ffaa00';
        this.ctx.fillRect(this.x + 15, this.y + this.height, 5, 10);
        this.ctx.fillRect(this.x + this.width - 20, this.y + this.height, 5, 10);
        
        this.ctx.restore();
    }
    
    reset() {
        this.x = this.canvas.width / 2 - this.width / 2;
        this.y = this.canvas.height - this.height - 20;
        this.health = this.maxHealth;
        this.lives = 3;
        this.isAlive = true;
        this.invulnerable = false;
        this.invulnerableTime = 0;
        this.weaponLevel = 1;
        this.fireRate = 300;
        this.bulletDamage = 25;
    }
}
