import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import HomeScreen from "./src/screens/HomeScreen";

const navigator = createStackNavigator(
  {
    Home: HomeScreen,
  },
  {
    initialRouteName: "Home",
    defaultNavigationOptions: {
      title: "BINGE SPOT",
      headerStyle: {
        backgroundColor: '#3f51b5',
      },
      headerTintColor: '#fff',
    },
  }
);

export default createAppContainer(navigator);
