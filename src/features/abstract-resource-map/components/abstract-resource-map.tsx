import {
  Map,
  MapLayerGroup,
  MapLayers,
  MapLayersControl,
  MapLocateControl,
  MapMarker,
  MapPopup,
  MapTileLayer,
  MapZoomControl,
} from "@/components/ui/map";

import { PWR_COORDINATES } from "../constants";

export function AbstractResourceMap({
  showLabellessLayer = false,
}: {
  showLabellessLayer?: boolean;
}) {
  return (
    <Map center={PWR_COORDINATES}>
      <MapLayers>
        <MapZoomControl />
        <MapLocateControl />
        <MapLayersControl />
        <MapTileLayer name="Z etykietami" />
        {showLabellessLayer ? (
          <MapTileLayer
            name="Bez etykiet"
            url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png"
            darkUrl="https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png"
          />
        ) : null}
        {/* TODO: make this abstract */}
        <MapLayerGroup name="Budynki">
          <MapMarker position={PWR_COORDINATES}>
            <MapPopup>D-1</MapPopup>
          </MapMarker>
        </MapLayerGroup>
      </MapLayers>
    </Map>
  );
}
