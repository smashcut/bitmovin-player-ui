import {SelectBox} from './selectbox';
import {ListSelectorConfig} from './listselector';
import {UIInstanceManager} from '../uimanager';

/**
 * A select box providing a selection between available audio tracks (e.g. different languages).
 */
export class AudioTrackSelectBox extends SelectBox {

  constructor(config: ListSelectorConfig = {}) {
    super(config);
  }

  configure(player: bitmovin.PlayerAPI, uimanager: UIInstanceManager): void {
    super.configure(player, uimanager);

    // TODO Move to config?
    let getAudioTrackLabel = (id: string) => {
      switch (id) {
        case 'en_stereo':
          return 'English - Stereo';
        case 'no-voices_stereo':
          return 'No Voices - Stereo';
        case 'en_surround':
          return 'English - Surround';
        default:
          return id;
      }
    };

    let selectCurrentAudioTrack = () => {
      let currentAudioTrack = player.getAudio();

      // HLS streams don't always provide this, so we have to check
      if (currentAudioTrack) {
        this.selectItem(currentAudioTrack.id);
      }
    };

    let updateAudioTracks = () => {
      let audioTracks = player.getAvailableAudio();

      this.clearItems();

      // Add audio tracks
      for (let audioTrack of audioTracks) {
        this.addItem(audioTrack.id, getAudioTrackLabel(audioTrack.label));
      }

      // Select the correct audio track after the tracks have been added
      // This is also important in case we missed the `ON_AUDIO_CHANGED` event, e.g. when `playback.audioLanguage`
      // is configured but the event is fired before the UI is created.
      selectCurrentAudioTrack();
    };

    this.onItemSelected.subscribe((sender: AudioTrackSelectBox, value: string) => {
      player.setAudio(value);
    });

    // Update selection when selected track has changed
    player.addEventHandler(player.EVENT.ON_AUDIO_CHANGED, selectCurrentAudioTrack);
    // Update tracks when source goes away
    player.addEventHandler(player.EVENT.ON_SOURCE_UNLOADED, updateAudioTracks);
    // Update tracks when a new source is loaded
    player.addEventHandler(player.EVENT.ON_READY, updateAudioTracks);
    // Update tracks when the period within a source changes
    player.addEventHandler(player.EVENT.ON_PERIOD_SWITCHED, updateAudioTracks);
    // Update tracks when a track is added or removed (since player 7.1.4)
    if (player.EVENT.ON_AUDIO_ADDED && player.EVENT.ON_AUDIO_REMOVED) {
      player.addEventHandler(player.EVENT.ON_AUDIO_ADDED, updateAudioTracks);
      player.addEventHandler(player.EVENT.ON_AUDIO_REMOVED, updateAudioTracks);
    }

    // Populate tracks at startup
    updateAudioTracks();
  }
}