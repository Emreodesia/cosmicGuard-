
![Uploading Gemini_Generated_Image_97faui97faui97fa.png…]()

# 🚀 Space Ship Defense Game

A thrilling space shooter defense game built with HTML5 Canvas and vanilla JavaScript. Defend your spaceship against incoming asteroids and alien ships!

## 🎮 How to Play

### Controls
- **Movement**: Use Arrow Keys (←, →) or A/D keys to move left and right
- **Shooting**: Press Spacebar to shoot bullets
- **Restart**: Press R key when game over to restart

### Objective
- Survive as long as possible by destroying enemies
- Avoid collisions with asteroids and alien ships
- Build up your score and reach higher levels
- Upgrade your weapons to become more powerful

## ✨ Features

### 🎯 Core Gameplay
- **Player Spaceship**: Control a responsive spaceship at the bottom of the screen
- **Enemy Types**: 
  - **Asteroids**: Simple objects that are destroyed in one hit
  - **Alien Ships**: Move side-to-side and require multiple hits to destroy
- **Progressive Difficulty**: Enemy spawn rate and speed increase over time

### 🔫 Weapon System
- **Level 1**: Single bullet with basic damage
- **Level 2**: Double bullets (unlocked at level 3)
- **Level 3**: Triple bullets with increased damage (unlocked at level 6)

### 💖 Health & Lives System
- **Health Bar**: 100 HP with visual health indicator
- **Lives**: 3 lives before game over
- **Invulnerability**: Brief invulnerability period after taking damage

### 🎨 Visual Effects
- **Starfield Background**: Animated space background
- **Explosion Effects**: Particle-based explosions when enemies are destroyed
- **Bullet Trails**: Glowing bullets with trailing effects
- **Score Popups**: Visual feedback when scoring points
- **Impact Particles**: Particle effects on collisions

### 🏆 Scoring & Progression
- **Score System**: Points for each destroyed enemy
- **Level System**: Progress through levels with increasing difficulty
- **Weapon Upgrades**: Automatic weapon improvements every 3 levels

## 🛠️ Technical Implementation

### Architecture
- **Modular Design**: Separate classes for Player, Enemy, Bullet, and Game
- **Canvas Rendering**: Smooth 60 FPS gameplay using requestAnimationFrame
- **Collision Detection**: Precise hitbox-based collision system
- **Particle System**: Dynamic particle effects for explosions and impacts

### Performance Features
- **Object Pooling**: Efficient memory management for game objects
- **Delta Time**: Smooth movement regardless of frame rate
- **Optimized Rendering**: Only draw visible objects

## 🚀 Getting Started

1. **Download** all game files to a folder
2. **Open** `index.html` in a modern web browser
3. **Click** "Start Game" to begin
4. **Enjoy** the space defense action!

### File Structure
```
space-ship-defense/
├── index.html          # Main HTML file
├── style.css           # Game styling and UI
├── game.js             # Main game logic and loop
├── player.js           # Player class and controls
├── enemy.js            # Enemy types and behavior
├── bullet.js           # Bullet system and effects
└── README.md           # This file
```

## 🎯 Game Tips

- **Stay Mobile**: Keep moving to avoid enemy fire
- **Prioritize Threats**: Focus on alien ships as they're more dangerous
- **Use Cover**: Use the edges of the screen strategically
- **Watch Your Health**: Don't let your health drop too low
- **Upgrade Weapons**: Survive long enough to unlock better weapons

## 🔧 Customization

The game is built with modularity in mind. You can easily:
- Adjust difficulty by modifying spawn rates and speeds
- Add new enemy types in the `Enemy` class
- Modify weapon behavior in the `Player` class
- Change visual effects in the drawing methods
- Add power-ups and special abilities

## 🌟 Future Enhancements

Potential additions for future versions:
- **Power-ups**: Health packs, shields, weapon upgrades
- **Boss Battles**: Epic boss encounters every 60 seconds
- **Sound Effects**: Background music and sound effects
- **Leaderboard**: Local high score storage
- **Multiple Weapons**: Different weapon types and firing modes
- **Level Design**: Pre-designed enemy patterns and formations

## 🎮 Browser Compatibility

- **Chrome**: ✅ Full support
- **Firefox**: ✅ Full support  
- **Safari**: ✅ Full support
- **Edge**: ✅ Full support

## 📝 License

This project is open source and available under the MIT License.

---

**Ready to defend the galaxy? Launch the game and start your space adventure!** 🚀✨

