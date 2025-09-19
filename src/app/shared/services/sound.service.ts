import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SoundService {
  private entranceAudio: HTMLAudioElement;
  private exitAudio: HTMLAudioElement;
  private pickupAudio: HTMLAudioElement;
  private defaultDelay = 5; // delay padrão em ms reduzido
  private defaultPlaybackRate = 1.5; // velocidade padrão
  private defaultVolume = 0.3; // volume padrão (30%)

  constructor() {
    this.entranceAudio = new Audio('assets/sound/door_opening.wav');
    this.entranceAudio.preload = 'auto';
    this.entranceAudio.playbackRate = this.defaultPlaybackRate;
    this.entranceAudio.volume = this.defaultVolume;

    this.exitAudio = new Audio('assets/sound/door_closing.wav');
    this.exitAudio.preload = 'auto';
    this.exitAudio.playbackRate = 1.5; // Som de saída na velocidade padrão
    this.exitAudio.volume = 0.15; // Volume mais baixo para o som de saída (15%)

    this.pickupAudio = new Audio('assets/sound/pickup.mp3');
    this.pickupAudio.preload = 'auto';
    this.pickupAudio.playbackRate = this.defaultPlaybackRate;
    this.pickupAudio.volume = this.defaultVolume;
  }

  /**
   * Reproduz o som de entrada
   * @param delay Delay em milissegundos antes de reproduzir (padrão: 10ms)
   */
  playEntrance(delay = this.defaultDelay): void {
    setTimeout(() => {
      this.entranceAudio.currentTime = 0; // Reinicia o áudio
      this.entranceAudio.play().catch(error => {
        console.error('Erro ao reproduzir som de entrada:', error);
      });
    }, delay);
  }

  /**
   * Reproduz o som de saída
   * @param delay Delay em milissegundos antes de reproduzir (padrão: 0ms para execução imediata)
   */
  playExit(delay = 0): void {
    if (delay > 0) {
      setTimeout(() => {
        this.exitAudio.currentTime = 0; // Reinicia o áudio
        this.exitAudio.play().catch(error => {
          console.error('Erro ao reproduzir som de saída:', error);
        });
      }, delay);
    } else {
      this.exitAudio.currentTime = 0; // Reinicia o áudio
      this.exitAudio.play().catch(error => {
        console.error('Erro ao reproduzir som de saída:', error);
      });
    }
  }

  /**
   * Reproduz o som de pickup
   * @param delay Delay em milissegundos antes de reproduzir (padrão: 0ms para execução imediata)
   */
  playPickup(delay = 0): void {
    if (delay > 0) {
      setTimeout(() => {
        this.pickupAudio.currentTime = 0; // Reinicia o áudio
        this.pickupAudio.play().catch(error => {
          console.error('Erro ao reproduzir som de pickup:', error);
        });
      }, delay);
    } else {
      this.pickupAudio.currentTime = 0; // Reinicia o áudio
      this.pickupAudio.play().catch(error => {
        console.error('Erro ao reproduzir som de pickup:', error);
      });
    }
  }

  /**
   * Para todos os sons
   */
  stopAll(): void {
    this.entranceAudio.pause();
    this.entranceAudio.currentTime = 0;
    this.exitAudio.pause();
    this.exitAudio.currentTime = 0;
    this.pickupAudio.pause();
    this.pickupAudio.currentTime = 0;
  }

  /**
   * Configura a velocidade de reprodução dos sons
   * @param rate Taxa de reprodução (1.0 = normal, 1.5 = 1.5x mais rápido)
   */
  setPlaybackRate(rate: number): void {
    this.entranceAudio.playbackRate = rate;
    this.exitAudio.playbackRate = rate;
    this.pickupAudio.playbackRate = rate;
  }

  /**
   * Configura o volume dos sons
   * @param volume Volume (0.0 = mudo, 1.0 = volume máximo)
   */
  setVolume(volume: number): void {
    this.entranceAudio.volume = Math.max(0, Math.min(1, volume));
    // exitAudio mantém seu volume específico mais baixo
    this.exitAudio.volume = Math.max(0, Math.min(1, volume * 0.5)); // 50% do volume definido
    this.pickupAudio.volume = Math.max(0, Math.min(1, volume));
  }
}