/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, {Component} from 'react';
import {
  KeyboardAvoidingView,
  SafeAreaView,
  Platform,
  ActivityIndicator,
} from 'react-native';

import VoxeetEnvironment, {CONFERENCE_ALIAS} from './src/VoxeetEnvironment';
import ParticipantsView from './src/components/ParticipantsView';
import {createConferenceParticipant, turnCamera} from './src/Utils';
import {
  ConferenceStatusUpdatedEvent,
  VoxeetSDK,
} from '@voxeet/react-native-voxeet-conferencekit';
import {UserType} from '@voxeet/react-native-voxeet-conferencekit/dist/types/JoinConference';
import {Codec} from '@voxeet/react-native-voxeet-conferencekit/dist/types/CreateConference';

export interface Props {}

export interface State {
  status?: ConferenceStatusUpdatedEvent;
}

export default class App extends Component<Props, State> {
  componentDidMount() {
    VoxeetEnvironment.addListener('initialization', this.onInit);
    VoxeetEnvironment.addListener('connect', this.onInit);
    VoxeetEnvironment.addListener(
      'ConferenceStatusUpdatedEvent',
      this.onStatus,
    );

    this.initialize();
  }

  componentWillUnmount() {
    VoxeetEnvironment.removeListener('initialization', this.onInit);
    VoxeetEnvironment.removeListener('connect', this.onInit);
    VoxeetEnvironment.removeListener(
      'ConferenceStatusUpdatedEvent',
      this.onStatus,
    );
  }

  private onStatus = (status: ConferenceStatusUpdatedEvent) => {
    this.setState({status});
  };

  private onInit = () => {
    this.forceUpdate();
  };

  private initialize = async () => {
    await VoxeetEnvironment.initialize();

    const participant = createConferenceParticipant();
    await VoxeetEnvironment.connect(participant);

    const conference = await VoxeetSDK.create({
      alias: CONFERENCE_ALIAS,
      params: {
        videoCodec: Codec.VP8,
      },
    });

    await VoxeetSDK.join(conference.conferenceId, {
      user: {
        type: UserType.USER,
      },
    });

    await turnCamera();
  };

  render() {
    return (
      <SafeAreaView style={{flex: 1}}>
        <KeyboardAvoidingView
          style={{flex: 1}}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          {!VoxeetEnvironment.initialized ? (
            <ActivityIndicator />
          ) : (
            <ParticipantsView />
          )}
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }
}
