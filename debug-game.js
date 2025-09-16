// Script de debug para verificar se o jogo está funcionando
console.log('🔍 Iniciando debug do jogo...');

// Verificar se o elemento gameContainer existe
setTimeout(() => {
  const gameContainer = document.getElementById('gameContainer');
  console.log('📦 gameContainer encontrado:', gameContainer);
  
  if (gameContainer) {
    console.log('✅ gameContainer existe');
    console.log('📏 Dimensões:', gameContainer.offsetWidth, 'x', gameContainer.offsetHeight);
    console.log('🎨 Estilos:', window.getComputedStyle(gameContainer));
    
    // Verificar se há canvas dentro do container
    const canvas = gameContainer.querySelector('canvas');
    console.log('🖼️ Canvas encontrado:', canvas);
    
    if (canvas) {
      console.log('✅ Canvas do Phaser existe!');
      console.log('📏 Canvas dimensões:', canvas.width, 'x', canvas.height);
    } else {
      console.log('❌ Canvas do Phaser NÃO encontrado!');
    }
  } else {
    console.log('❌ gameContainer NÃO encontrado!');
  }
  
  // Verificar se o Phaser foi carregado
  if (typeof Phaser !== 'undefined') {
    console.log('✅ Phaser carregado:', Phaser.VERSION);
  } else {
    console.log('❌ Phaser NÃO carregado!');
  }
}, 2000);