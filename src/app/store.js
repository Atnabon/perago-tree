import { configureStore} from "@reduxjs/toolkit";
import dialogReducer from "../features/dialog/positionSlice";
import positionReducer from "../features/position/positionSlice";

const store = configureStore({
  reducer: {
        dialog: dialogReducer,
      position:positionReducer,
  },
 
});

export default store;
