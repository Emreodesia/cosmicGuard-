class Bullet {
    constructor(x, y, speed, damage) {
        this.x = x;
        this.y = y;
        this.width = 4;
        this.height = 12;
        this.speed = speed;
        this.damage = damage;
        this.isAlive = true;
        
        // Visual effects
        this.trail = [];
        this.maxTrailLength = 5;
        this.glowIntensity = 1;
        this.glowDirection = -0.05;
    }
    
    update(deltaTime) {
        if (!this.isAlive) return;
        
        // Store position for trail effect
        this.trail.push({ x: this.x, y: this.y });
        if (this.trail.length > this.maxTrailLength) {
            this.trail.shift();
        }
        
        // Move bullet upward
        this.y -= this.speed;
        
        // Update glow effect
        this.glowIntensity += this.glowDirection;
        if (this.glowIntensity <= 0.3 || this.glowIntensity >= 1) {
            this.glowDirection *= -1;
        }
        
        // Check if bullet is off-screen
        if (this.y + this.height < 0) {
            this.isAlive = false;
        }
    }
    
    draw(ctx) {
        if (!this.isAlive) return;
        
        ctx.save();
        
        // Draw bullet trail
        for (let i = 0; i < this.trail.length; i++) {
            const alpha = i / this.trail.length * 0.6;
            const size = (i / this.trail.length) * 2 + 1;
            
            ctx.globalAlpha = alpha;
            ctx.fillStyle = '#00FFFF';
            ctx.fillRect(
                this.trail[i].x - size/2,
                this.trail[i].y - size/2,
                size,
                size
            );
        }
        
        // Draw main bullet with glow effect
        ctx.globalAlpha = 1;
        
        // Outer glow
        ctx.shadowColor = '#00FFFF';
        ctx.shadowBlur = 10 * this.glowIntensity;
        ctx.fillStyle = '#00FFFF';
        ctx.fillRect(this.x - 2, this.y - 2, this.width + 4, this.height + 4);
        
        // Inner bullet
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Bullet tip
        ctx.fillStyle = '#00FFFF';
        ctx.beginPath();
        ctx.moveTo(this.x + this.width / 2, this.y);
        ctx.lineTo(this.x, this.y + 6);
        ctx.lineTo(this.x + this.width, this.y + 6);
        ctx.closePath();
        ctx.fill();
        
        ctx.restore();
    }
    
    // Check collision with enemy
    checkCollision(enemy) {
        return this.x < enemy.x + enemy.width &&
               this.x + this.width > enemy.x &&
               this.y < enemy.y + enemy.height &&
               this.y + this.height > enemy.y;
    }
    
    // Destroy bullet
    destroy() {
        this.isAlive = false;
    }
}
