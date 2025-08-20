class Enemy {
    constructor(canvas, type = 'asteroid') {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.type = type;
        this.isAlive = true;
        
        // Set properties based on enemy type
        if (type === 'asteroid') {
            this.width = Math.random() * 30 + 20; // 20-50
            this.height = this.width;
            this.health = 1;
            this.maxHealth = 1;
            this.speed = Math.random() * 2 + 1; // 1-3
            this.damage = 20;
            this.score = 10;
            this.color = '#8B4513';
            this.secondaryColor = '#654321';
        } else if (type === 'alien') {
            this.width = 35;
            this.height = 25;
            this.health = 3;
            this.maxHealth = 3;
            this.speed = Math.random() * 1.5 + 1.5; // 1.5-3
            this.damage = 30;
            this.score = 25;
            this.color = '#FF4444';
            this.secondaryColor = '#CC0000';
            
            // Alien movement pattern
            this.movementPattern = 'sideways';
            this.sidewaysSpeed = Math.random() * 2 + 1;
            this.sidewaysDirection = Math.random() > 0.5 ? 1 : -1;
            this.sidewaysRange = 100;
            this.startX = 0;
        }
        
        // Position
        this.x = Math.random() * (canvas.width - this.width);
        this.y = -this.height;
        
        // Animation
        this.rotation = 0;
        this.rotationSpeed = (Math.random() - 0.5) * 0.2;
        
        // Explosion effect
        this.exploding = false;
        this.explosionParticles = [];
        this.explosionTimer = 0;
    }
    
    update(deltaTime) {
        if (!this.isAlive || this.exploding) return;
        
        // Move downward
        this.y += this.speed;
        
        // Handle alien movement pattern
        if (this.type === 'alien' && this.movementPattern === 'sideways') {
            if (this.startX === 0) {
                this.startX = this.x;
            }
            
            this.x += this.sidewaysSpeed * this.sidewaysDirection;
            
            // Change direction when reaching movement range
            if (Math.abs(this.x - this.startX) > this.sidewaysRange) {
                this.sidewaysDirection *= -1;
            }
        }
        
        // Rotate asteroids
        if (this.type === 'asteroid') {
            this.rotation += this.rotationSpeed;
        }
        
        // Check if enemy is off-screen
        if (this.y > this.canvas.height) {
            this.isAlive = false;
        }
    }
    
    takeDamage(damage) {
        this.health -= damage;
        
        if (this.health <= 0) {
            this.explode();
            return true; // Enemy destroyed
        }
        return false;
    }
    
    explode() {
        this.exploding = true;
        this.explosionTimer = 30; // frames for explosion animation
        
        // Create explosion particles
        for (let i = 0; i < 15; i++) {
            this.explosionParticles.push({
                x: this.x + this.width / 2,
                y: this.y + this.height / 2,
                vx: (Math.random() - 0.5) * 8,
                vy: (Math.random() - 0.5) * 8,
                life: Math.random() * 30 + 20,
                maxLife: 50,
                size: Math.random() * 4 + 2
            });
        }
    }
    
    updateExplosion() {
        if (!this.exploding) return;
        
        this.explosionTimer--;
        
        // Update particles
        for (let i = this.explosionParticles.length - 1; i >= 0; i--) {
            const particle = this.explosionParticles[i];
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.life--;
            
            // Remove dead particles
            if (particle.life <= 0) {
                this.explosionParticles.splice(i, 1);
            }
        }
        
        // End explosion when all particles are gone
        if (this.explosionParticles.length === 0 && this.explosionTimer <= 0) {
            this.isAlive = false;
        }
    }
    
    draw() {
        if (!this.isAlive) return;
        
        if (this.exploding) {
            this.drawExplosion();
            return;
        }
        
        this.ctx.save();
        
        if (this.type === 'asteroid') {
            this.drawAsteroid();
        } else if (this.type === 'alien') {
            this.drawAlien();
        }
        
        this.ctx.restore();
    }
    
    drawAsteroid() {
        this.ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        this.ctx.rotate(this.rotation);
        
        // Draw irregular asteroid shape
        this.ctx.fillStyle = this.color;
        this.ctx.beginPath();
        this.ctx.moveTo(0, -this.height / 2);
        
        // Create jagged edges
        const segments = 8;
        for (let i = 1; i <= segments; i++) {
            const angle = (i / segments) * Math.PI * 2;
            const radius = this.width / 2 + (Math.random() - 0.5) * 10;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            this.ctx.lineTo(x, y);
        }
        
        this.ctx.closePath();
        this.ctx.fill();
        
        // Add some surface details
        this.ctx.fillStyle = this.secondaryColor;
        for (let i = 0; i < 3; i++) {
            const x = (Math.random() - 0.5) * this.width * 0.6;
            const y = (Math.random() - 0.5) * this.height * 0.6;
            const size = Math.random() * 5 + 2;
            this.ctx.fillRect(x - size/2, y - size/2, size, size);
        }
    }
    
    drawAlien() {
        // Draw alien body
        this.ctx.fillStyle = this.color;
        this.ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Draw alien details
        this.ctx.fillStyle = this.secondaryColor;
        this.ctx.fillRect(this.x + 5, this.y + 5, this.width - 10, this.height - 10);
        
        // Draw alien eyes
        this.ctx.fillStyle = '#00FF00';
        this.ctx.fillRect(this.x + 8, this.y + 8, 6, 6);
        this.ctx.fillRect(this.x + this.width - 14, this.y + 8, 6, 6);
        
        // Draw alien mouth
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(this.x + this.width / 2 - 4, this.y + this.height - 12, 8, 3);
        
        // Draw alien antennae
        this.ctx.strokeStyle = this.color;
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(this.x + 5, this.y);
        this.ctx.lineTo(this.x + 2, this.y - 8);
        this.ctx.moveTo(this.x + this.width - 5, this.y);
        this.ctx.lineTo(this.x + this.width - 2, this.y - 8);
        this.ctx.stroke();
    }
    
    drawExplosion() {
        // Draw explosion particles
        this.ctx.save();
        for (const particle of this.explosionParticles) {
            const alpha = particle.life / particle.maxLife;
            this.ctx.globalAlpha = alpha;
            
            // Create gradient for particles
            const gradient = this.ctx.createRadialGradient(
                particle.x, particle.y, 0,
                particle.x, particle.y, particle.size
            );
            gradient.addColorStop(0, '#FFFF00');
            gradient.addColorStop(0.5, '#FF8800');
            gradient.addColorStop(1, '#FF0000');
            
            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
        }
        this.ctx.restore();
    }
    
    // Check collision with other objects
    checkCollision(obj) {
        return this.x < obj.x + obj.width &&
               this.x + this.width > obj.x &&
               this.y < obj.y + obj.height &&
               this.y + this.height > obj.y;
    }
}
