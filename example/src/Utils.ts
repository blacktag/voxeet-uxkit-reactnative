import {Platform} from 'react-native';
import {
  ConferenceParticipant,
  ConferenceStatusUpdatedEvent,
  VoxeetSDK,
} from '@voxeet/react-native-voxeet-conferencekit';
import {
  check,
  Permission,
  PERMISSIONS,
  PermissionStatus,
  request,
  RESULTS,
} from 'react-native-permissions';

export function inConference(status: ConferenceStatusUpdatedEvent) {
  if (!status || !status.status) return true;

  switch (status.status) {
    case 'DEFAULT':
      return false;
    case 'CREATING':
      return false;
    case 'CREATED':
      return false;
    case 'JOINING':
      return true;
    case 'JOINED':
      return true;
    case 'FIRST_PARTICIPANT':
      return true;
    case 'NO_MORE_PARTICIPANT':
      return true;
    case 'LEAVING':
      return false;
    case 'LEFT':
      return false;
    case 'ERROR':
      return false;
    case 'DESTROYED':
      return false;
    case 'ENDED':
    default:
      return false;
  }
}

export const createConferenceParticipant = () => {
  const id = Date.now();

  return new ConferenceParticipant(
    id.toString(),
    `user_${id}`,
    `https://i.pravatar.cc/300?u=${id}`,
  );
};

export const CAMERA_PERMISSION: Permission | undefined = Platform.select({
  android: PERMISSIONS.ANDROID.CAMERA,
  ios: PERMISSIONS.IOS.CAMERA,
});

export const checkCameraPermission = async (): Promise<boolean> => {
  const status = await check(CAMERA_PERMISSION);
  switch (status) {
    case RESULTS.GRANTED:
    case RESULTS.LIMITED: {
      return true;
    }
    default: {
      return true;
    }
  }
};

export const turnCamera = async (): Promise<boolean> => {
  const haveCameraPermission = await checkCameraPermission();

  if (!haveCameraPermission) {
    const result = await request(CAMERA_PERMISSION);
    return false;
  }
  try {
    await VoxeetSDK.startVideo();
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
};
