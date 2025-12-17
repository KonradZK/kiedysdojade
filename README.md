# KeidyśDojadeApp backend

## Endpoints
Base URL: 'https://kiedysdojade.projektstudencki.pl/api/'

## Flow



### Path
| Method | Endpoint       | Description                  | Parameters                                                    |
|--------|----------------|------------------------------|---------------------------------------------------------------|
| GET    | /path     | Retrieve path between chosen stops    | start_code=SOB42&end_code=SWCZ72&departure_time=11:00&limit=5 |

```json
[
  [
      {
        "stop":{
          "id":2,
          "code":"SOB42",
          "name":"Os. Sobieskiego",
          "lat":52.46380003,
          "lon":16.91666018,
          "zone_id":"A"
        },
        "line":null,
        "departure_time":"11:02",
        "arrival_time":null
      }, 
      ...
      {
        "stop": {
          "id": 111,
          "code": "SWCZ72",
          "name": "Św. Czesława",
          "lat": 52.39758138,
          "lon": 16.92137225,
          "zone_id": "A"
        },
        "line":"WALK",
        "departure_time":null,
        "arrival_time":"11:32"
      }
  ],
  [
    {
      "stop": {
        "id":2,
        "code":"SOB42",
        "name":"Os. Sobieskiego",
        "lat":52.46380003,
        "lon":16.91666018,
        "zone_id":"A"
      },
      "line":null,
      "departure_time":"11:06",
      "arrival_time":null
    },
    ...
  ],
  ...
]



```

### Route

| Method | Endpoint       | Description                  | Parameters|
|--------|----------------|------------------------------|-------|
| GET    | /routes         | Retrieve all routes        | page=1   |
| GET    | /routes/{id}    | Retrieve a specific route     | |
| GET    | /routes/{id}/trips    | Retrieve specific route's trips     | |
| GET    | /routes/count    | Retrieve number of routes    | |

```json
{
    "agency_id":2,
    "id":"1",
    "short_name":"1",
    "long_name":"BUDZISZYŃSKA - FRANOWO|FRANOWO - BUDZISZYŃSKA",
    "type":0,
    "color":13631599,
    "text_color":13631599
},
```

### Shape
| Method | Endpoint       | Description                  | Parameters|
|--------|----------------|------------------------------|-------|
| GET    | /shapes/{shape_id}    | Retrieve a specific shape    | |
|GET | shapes/{route_id}/between| Retrieve routes shape slice between two given stops |?start_code=MT44&end_code=SOB41 | |

```json
{
    "id":821841,
    "lat":52.400459409433,
    "lon":17.06526411332,
    "sequence":1
},
{"id":821841,"lat":52.400990936794,"lon":17.066075779306,"sequence":2},{"id":821841,"lat":52.401324264245,"lon":17.066769384786,"sequence":3},
```

### Stop
| Method | Endpoint       | Description                  | Parameters|
|--------|----------------|------------------------------|-------|
| GET    | /stops         | Retrieve all stops        | page=1   |
| GET    | /stops/{id}    | Retrieve a specific stop     | |
| GET    | /stops/count    | Retrieve number of stops    | |
| GET    | /stops/search    | Retrieve stop with given name   | name=Sobieskiego or code="SOB"|
| GET    | /stops/closest   | Retrieve stops by distance   | lat=52.46758351021632&lon=16.92682956098633 |
|GET|stops/groups| Retrieve all groups with codes and names||
|GET | stops/groupnames | Retrieve all groupnames||


```json
{
    "id":3,
    "code":"SOB41",
    "name":"Os. Sobieskiego",
    "lat":52.46395042,
    "lon":16.91782149,
    "zone_id":"A"
}

```

### Stop Time
| Method | Endpoint       | Description                  | Parameters|
|--------|----------------|------------------------------|-------|
| GET    | /stop_times/trip        | Retrieve stop times by trip id        | trip=   |
| GET    | /stop_times/stop        | Retrieve stop times by stop id        | stop=    |

```json
{
    "trip_id":"1_6438281^Y+",
    "arrival_time":"05:38:00.000000",
    "departure_time":"05:38:00.000000",
    "stop_id":4328,
    "stop_sequence":0,
    "stop_headsign":"POZNAŃ GŁÓWNY",
    "pickup_type":0,
    "drop_off_type":1
},
```


### Trip
| Method | Endpoint       | Description                  | Parameters|
|--------|----------------|------------------------------|-------|
| GET    | /trips      | Retrieve all trips      | page=10  |
| GET    | /trips/{id}       | Retrieve a specific trip     |    |
| GET    | /trips/{id}/stops       | Retrieve specific trip's stops      |    |
| GET    | /trips/{id}/shape       | Retrieve specific trip's shape      |    |




```json
{
    "route_id":"486",
    "service_id":1,
    "id":"1_4992360^Y+",
    "head_sign":"Siekierki Wielkie/Kościół",
    "direction_id":true,
    "shape_id":821857,
    "wheelchair_accessible":false,
    "brigade":35
}

```




### Agency
| Method | Endpoint       | Description                  |
|--------|----------------|------------------------------|
| GET    | /agencies         | Retrieve all agencies     |


```json
{
    "id":2,
    "name":"Miejskie Przedsiębiorstwo Komunikacyjne Sp. z o.o. w Poznaniu",
    "url":"http://www.mpk.poznan.pl",
    "timezone":"Europe/Warsaw",
    "lang":"61 646 33 44",
    "phone":"pl"
}
```


### Calendar
Kalendarz nie ma wpisów dla wszystkich przewoźników
| Method | Endpoint       | Description                  |
|--------|----------------|------------------------------|
| GET    | /calendar/{id}         | Retrieve all users           |

```json
{
    "service_id":4,
    "monday":false,
    "tuesday":false,
    "wednesday":false,
    "thursday":false,
    "friday":false,
    "saturday":false,
    "sunday":true,
    "start_date":"2025-11-15T00:00:00Z",
    "end_date":"2025-11-30T00:00:00Z"
}
```