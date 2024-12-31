const letters = document.querySelectorAll('.letter');
    letters.forEach((letter, index) => {
    setTimeout(() => {
    letter.style.opacity = 1;
    }, index * 100);
});


setTimeout(function() {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const rockets = [];
    const fireworks = [];
    const colors = ['#FF5733', '#FFC300', '#DAF7A6', '#FF33F6', '#33FFF6', '#FF5733'];

    // Rocket class
    class Rocket {
      constructor(x, targetY) {
        this.x = x;
        this.y = canvas.height;
        this.speed = -Math.random() * 3 - 5;
        this.curve = Math.random() * 0.5 - 0.25; // Slight curve left/right
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.targetY = targetY;
        this.exploded = false;
      }

      update() {
        if (!this.exploded) {
          this.y += this.speed;
          this.x += this.curve; // Add horizontal curve
          if (this.y <= this.targetY) {
            this.exploded = true;
            createFirework(this.x, this.y);
          }
        }
      }

      draw() {
        if (!this.exploded) {
          // Add a glowing effect to the rocket
          ctx.strokeStyle = this.color;
          ctx.lineWidth = 2;
          ctx.shadowBlur = 10;
          ctx.shadowColor = this.color; // Create a glow effect
          ctx.beginPath();
          ctx.moveTo(this.x, this.y);
          ctx.lineTo(this.x, this.y + 10);
          ctx.stroke();
          ctx.shadowBlur = 0; // Reset shadow
        }
      }
    }

    // Firework class
    class Firework {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.particles = [];
        for (let i = 0; i < 100; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = Math.random() * 4 + 2;
          this.particles.push({
            x: x,
            y: y,
            speedX: Math.cos(angle) * speed,
            speedY: Math.sin(angle) * speed,
            gravity: 0.05, // Simulate gravity
            drag: 0.98, // Reduce speed over time
            color: colors[Math.floor(Math.random() * colors.length)],
            life: 100,
            alpha: 1,
            curve: Math.random() * 0.2 - 0.1, // Random bending curve
            shine: Math.random() * 2 + 1, // Brightness level
          });
        }
      }

      update() {
        this.particles.forEach((particle) => {
          particle.speedY += particle.gravity; // Gravity effect
          particle.speedX *= particle.drag; // Apply drag
          particle.speedY *= particle.drag; // Apply drag
          particle.x += particle.speedX + particle.curve; // Bend particle trajectory
          particle.y += particle.speedY;
          particle.life -= 2;
          particle.alpha = particle.life / 100;

          // Increase the shine effect as particles move
          particle.shine = Math.max(particle.shine - 0.05, 0);
        });

        this.particles = this.particles.filter((particle) => particle.life > 0);
      }

      draw() {
        this.particles.forEach((particle) => {
          ctx.fillStyle = `rgba(${hexToRgb(particle.color)}, ${particle.alpha})`;
          ctx.shadowBlur = particle.shine; // Apply shine effect
          ctx.shadowColor = particle.color; // Color of the shine
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, 3, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0; // Reset shadow
        });
      }
    }

    function createFirework(x, y) {
      fireworks.push(new Firework(x, y));
    }

    function hexToRgb(hex) {
      const bigint = parseInt(hex.replace('#', ''), 16);
      const r = (bigint >> 16) & 255;
      const g = (bigint >> 8) & 255;
      const b = bigint & 255;
      return `${r}, ${g}, ${b}`;
    }

    function spawnRocket() {
      const numRockets = Math.floor(Math.random() * 3) + 1; // Launch 1 to 3 rockets
      for (let i = 0; i < numRockets; i++) {
        // Adding a horizontal offset to the rocket's starting position
        const x = Math.random() * canvas.width * 0.2 + canvas.width * 0.4; // Random horizontal position within a 40% range of the screen width
        const targetY = canvas.height / 2 - Math.random() * canvas.height / 4;
        rockets.push(new Rocket(x, targetY));
      }
    }

    function update() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      rockets.forEach((rocket, index) => {
        rocket.update();
        rocket.draw();
        if (rocket.exploded) {
          rockets.splice(index, 1);
        }
      });

      fireworks.forEach((firework, index) => {
        firework.update();
        firework.draw();
        if (firework.particles.length === 0) {
          fireworks.splice(index, 1);
        }
      });

      requestAnimationFrame(update);
    }

    function randomRocketSpawner() {
      spawnRocket();
      setTimeout(randomRocketSpawner, Math.random() * 1000 + 500); // Random interval between 500ms and 1500ms
    }

    // Start the animation
    update();
    randomRocketSpawner();

  }, 4000);
