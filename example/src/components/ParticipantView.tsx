import React, {Component} from 'react';
import Participant from '@voxeet/react-native-voxeet-conferencekit/dist/types/Participant';
import {Image, StyleSheet, Text, View} from 'react-native';
import VoxeetEnvironment from '../VoxeetEnvironment';
import {
  StreamAddedEvent,
  StreamRemovedEvent,
  StreamUpdatedEvent,
} from '@voxeet/react-native-voxeet-conferencekit/dist/events/ConferenceUsersEvent';
import {
  MediaStream,
  VideoView,
  VoxeetSDK,
} from '@voxeet/react-native-voxeet-conferencekit';
import {MediaStreamType} from '@voxeet/react-native-voxeet-conferencekit/dist/types/MediaStream';

export interface Props {
  participant: string;
}

interface State {
  streams?: MediaStream[];
}

export default class ParticipantView extends Component<Props, State> {
  private participant?: Participant;
  state: State = {};
  private videoView: VideoView | null = null;

  private avatar() {
    if (!this.participant || !this.participant.avatarUrl)
      return <View style={styles.image} />;
    return (
      <Image style={styles.image} source={{uri: this.participant.avatarUrl}} />
    );
  }

  componentDidMount() {
    this.refreshStreams();
    VoxeetEnvironment.addListener('ParticipantAddedEvent', this.update);
    VoxeetEnvironment.addListener('ParticipantUpdatedEvent', this.update);
    VoxeetEnvironment.addListener('StreamAddedEvent', this.onStreamUpdate);
    VoxeetEnvironment.addListener('StreamUpdatedEvent', this.onStreamUpdate);
    VoxeetEnvironment.addListener('StreamRemovedEvent', this.onStreamUpdate);
  }

  componentWillUnmount() {
    VoxeetEnvironment.removeListener('StreamAddedEvent', this.onStreamUpdate);
    VoxeetEnvironment.removeListener('StreamUpdatedEvent', this.onStreamUpdate);
    VoxeetEnvironment.removeListener('StreamRemovedEvent', this.onStreamUpdate);
    VoxeetEnvironment.removeListener('ParticipantAddedEvent', this.update);
    VoxeetEnvironment.removeListener('ParticipantUpdatedEvent', this.update);
  }

  private onStreamUpdate = async (
    event: StreamAddedEvent | StreamUpdatedEvent | StreamRemovedEvent,
  ) => {
    const {participantId} = event.participant;

    if (participantId === this.props.participant) {
      this.refreshStreams();
    }
  };

  private refreshStreams = async () => {
    try {
      const {participant} = this.props;
      const streams = await VoxeetSDK.streams(participant);
      this.setState({streams});

      const cameraStream = streams
        ? streams.find(s => s.type == 'Camera')
        : undefined;

      if (!this.videoView) return;
      if (cameraStream && cameraStream.hasVideoTracks) {
        const user = new Participant(participant); //we only need a pointer to the native
        await this.videoView.attach(user, cameraStream);
      } else {
        await this.videoView.unattach();
      }
    } catch (e) {
      console.error('onStreamUpdate error', e);
    }
  };

  private update = async (event: any) => {
    await VoxeetEnvironment.participants();
    this.participant = VoxeetEnvironment.participant(this.props.participant);
    this.forceUpdate();
  };

  private setVideoView(videoView: VideoView | null) {
    this.videoView = videoView;
  }

  render() {
    const {streams} = this.state;
    this.participant = VoxeetEnvironment.participant(this.props.participant);

    const cameraStream = streams
      ? streams.find(s => s.type == 'Camera')
      : undefined;
    const {hasAudioTracks, hasVideoTracks} = cameraStream || {
      hasAudioTracks: false,
      hasVideoTracks: false,
    };

    if (!this.participant) return null;

    return (
      <View
        style={{
          flex: 1,
          backgroundColor: 'black',
          borderWidth: 4,
          borderColor: 'red',
        }}>
        <VideoView
          style={{flex: 1}}
          scaleType={'fill'}
          ref={(ref: VideoView | null) => this.setVideoView(ref)}
        />
        <View style={{position: 'absolute'}}>
          <Text style={{color: 'white'}}>
            {this.participant.name || this.participant.participantId || ''}
          </Text>
          {!!this.participant.avatarUrl && (
            <Image
              style={styles.image}
              source={{uri: this.participant.avatarUrl}}
            />
          )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  image: {width: 50, height: 50},
});