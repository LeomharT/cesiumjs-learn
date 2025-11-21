import {
  Cartesian3,
  Math as CesiumMath,
  createOsmBuildingsAsync,
  Ion,
  Terrain,
  Viewer,
} from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";
import "./index.css";

window.CESIUM_BASE_URL = "/node_modules/cesium/Build/Cesium";

Ion.defaultAccessToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIzN2RkY2RhMS01NWM5LTRjOWItODg3OC0zMDc4OGIzNDg4NzAiLCJpZCI6MzYyMTE1LCJpYXQiOjE3NjM2MjU4NTd9.mnpV378nQyIT8wpDmKTmV_gUMHbp6TNfb9VYcZPmNkE";

const viewer = new Viewer("root", {
  terrain: Terrain.fromWorldTerrain(),
});
viewer.camera.flyTo({
  destination: Cartesian3.fromDegrees(-122.4175, 37.655, 400),
  orientation: {
    heading: CesiumMath.toRadians(0.0),
    pitch: CesiumMath.toRadians(-15.0),
  },
});
const buildingTileset = await createOsmBuildingsAsync();
viewer.scene.primitives.add(buildingTileset);
