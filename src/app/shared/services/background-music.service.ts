import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BackgroundMusicService {
  private backgroundAudios: HTMLAudioElement[] = [];
  private currentTrackIndex = 0;
  private isPlaying = false;
  private defaultVolume = 0.1; // 10% de volume

  // Lista de músicas de fundo disponíveis
  private backgroundTracks = [
    'assets/sound/sound-background-1.mp3'
    // Adicione mais músicas aqui conforme necessário
  ];

  constructor() {
    this.initializeAudios();
  }

  /**
   * Inicializa os elementos de áudio para todas as músicas de fundo
   */
  private initializeAudios(): void {
    this.backgroundTracks.forEach((track) => {
      const audio = new Audio(track);
      audio.preload = 'auto';
      audio.loop = true;
      audio.volume = this.defaultVolume;
      
      // Adiciona evento para tocar a próxima música quando uma terminar (caso loop seja desabilitado)
      audio.addEventListener('ended', () => {
        this.playNext();
      });
      
      this.backgroundAudios.push(audio);
    });
  }

  /**
   * Inicia a reprodução da música de fundo
   * @param trackIndex Índice da música a ser tocada (opcional, padrão: 0)
   * @param shouldPlay Se deve reproduzir a música (padrão: false)
   */
  play(trackIndex = 0, shouldPlay = false): void {
    if (this.backgroundAudios.length === 0) {
      console.warn('Nenhuma música de fundo disponível');
      return;
    }

    if (!shouldPlay) {
      console.log('Música de fundo não será reproduzida (shouldPlay = false)');
      return;
    }

    this.stop(); // Para qualquer música que esteja tocando
    
    this.currentTrackIndex = Math.max(0, Math.min(trackIndex, this.backgroundAudios.length - 1));
    const currentAudio = this.backgroundAudios[this.currentTrackIndex];
    
    currentAudio.currentTime = 0;
    
    // Aguarda interação do usuário para evitar bloqueio do navegador
    const playAudio = () => {
      currentAudio.play().then(() => {
        this.isPlaying = true;
        console.log(`Reproduzindo música de fundo: ${this.backgroundTracks[this.currentTrackIndex]}`);
      }).catch(error => {
        console.error('Erro ao reproduzir música de fundo:', error);
        // Se falhar, tenta novamente após interação do usuário
        document.addEventListener('click', playAudio, { once: true });
        document.addEventListener('keydown', playAudio, { once: true });
      });
    };
    
    // Tenta reproduzir imediatamente, se falhar aguarda interação
    playAudio();
  }

  /**
   * Para a reprodução da música de fundo
   */
  stop(): void {
    this.backgroundAudios.forEach(audio => {
      audio.pause();
      audio.currentTime = 0;
    });
    this.isPlaying = false;
  }

  /**
   * Pausa a música de fundo atual
   */
  pause(): void {
    if (this.isPlaying && this.backgroundAudios[this.currentTrackIndex]) {
      this.backgroundAudios[this.currentTrackIndex].pause();
      this.isPlaying = false;
    }
  }

  /**
   * Pausa ou despausa a música de fundo
   * @param shouldPause Se deve pausar (true) ou despausar (false)
   */
  togglePause(shouldPause: boolean): void {
    if (shouldPause) {
      this.pause();
    } else {
      this.resume();
    }
  }

  /**
   * Resume a música de fundo pausada
   */
  resume(): void {
    if (!this.isPlaying && this.backgroundAudios[this.currentTrackIndex]) {
      this.backgroundAudios[this.currentTrackIndex].play().then(() => {
        this.isPlaying = true;
      }).catch(error => {
        console.error('Erro ao resumir música de fundo:', error);
      });
    }
  }

  /**
   * Toca a próxima música da lista
   */
  playNext(): void {
    const nextIndex = (this.currentTrackIndex + 1) % this.backgroundAudios.length;
    this.play(nextIndex);
  }

  /**
   * Toca a música anterior da lista
   */
  playPrevious(): void {
    const prevIndex = this.currentTrackIndex === 0 
      ? this.backgroundAudios.length - 1 
      : this.currentTrackIndex - 1;
    this.play(prevIndex);
  }

  /**
   * Configura o volume da música de fundo
   * @param volume Volume (0.0 = mudo, 1.0 = volume máximo)
   */
  setVolume(volume: number): void {
    this.defaultVolume = Math.max(0, Math.min(1, volume));
    this.backgroundAudios.forEach(audio => {
      audio.volume = this.defaultVolume;
    });
  }

  /**
   * Obtém o volume atual
   */
  getVolume(): number {
    return this.defaultVolume;
  }

  /**
   * Verifica se alguma música está tocando
   */
  getIsPlaying(): boolean {
    return this.isPlaying;
  }

  /**
   * Obtém o índice da música atual
   */
  getCurrentTrackIndex(): number {
    return this.currentTrackIndex;
  }

  /**
   * Obtém a lista de músicas disponíveis
   */
  getAvailableTracks(): string[] {
    return [...this.backgroundTracks];
  }

  /**
   * Adiciona uma nova música à lista
   * @param trackPath Caminho para o arquivo de áudio
   */
  addTrack(trackPath: string): void {
    this.backgroundTracks.push(trackPath);
    
    const audio = new Audio(trackPath);
    audio.preload = 'auto';
    audio.loop = true;
    audio.volume = this.defaultVolume;
    
    audio.addEventListener('ended', () => {
      this.playNext();
    });
    
    this.backgroundAudios.push(audio);
  }
}