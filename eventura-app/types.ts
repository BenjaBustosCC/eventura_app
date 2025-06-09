import {StackNavigationProp} from '@react-navigation/stack';

export type RootStackParamList = {
    SplashScreen: undefined;
    Login: undefined;
    Home: undefined;
    Register: undefined;
    EditarEvento: { id: string };
    HomeTabs: undefined;
    EventScreen: undefined;
    DetalleEventoScreen: undefined;
}