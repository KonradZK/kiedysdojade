import type { LatLngExpression } from "leaflet";

// poprawienie typów

const markerPositions: LatLngExpression[] = [
  [52.397587, 16.921295],
  // [52.401939, 16.920834],
  [52.40309, 16.915453],
];

const polylines: LatLngExpression[][] = [
  [
    [52.397587, 16.921295],
    [52.401773, 16.92168],
    [52.40309, 16.915453],
  ],
  //   [
  //     [52.3906, 16.919898],
  //     [52.4114, 16.929719],
  //     [52.411664, 16.92],
  //     [52.4, 16.92],
  //   ],
];

export { markerPositions, polylines };
