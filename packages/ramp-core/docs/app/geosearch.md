# Geosearch

The Geosearch component is contained inside a panel in the application. Geosearch makes use of the [Geogratis services](http://geogratis.gc.ca/).

## Component Breakdown

The Geosearch component can be broken down into multiple parts: search bar, Geosearch filters, and a list of returned Geosearch results.

### Geosearch Bar:

In the header of the Geosearch panel, there is a search bar which allows users to search for various locations in Canada using any of the supported search types mentioned below. To the right of the search bar is the usual pin and close panel buttons.

![](./images/geosearch-search.png)

#### Supported Search Types

**Keyword search**: Type any keyword into Geosearch to display a list of results that contains the keyword.
- each search result consists of: location name (with search keyword highlighted), location province, and location type (lake, city, town, etc.)
- click on any individual result to mark its coordinates and zoom the map to center around this location

**FSA search**: A **forward sortation area (FSA)** is a way to designate a geographical area based on the first three characters in a Canadian postal code. All postal codes that start with the same three characters are considered an **FSA**.
- a search using FSA will display a list of results in the vicinity of that area
- the very first result is a location of the FSA itself, click to zoom and center the map on the FSA
- example: type in **M3H**

**Latitude/Longitude search**: Search using lat/long coordinates to display a list of results in the vicinity of that map point.
- similarly to FSA search, the first result will be a location of those coordinates entered, click this to zoom and center the map on the map point
- lat/long search recognizes spaces, commas, semicolons, or vertical bars (|) to separate the co-ordinates
- example: type in **54.3733, -91.7417**

**NTS search**: **National Topographic System (NTS)** is a system used for providing general topographic maps of the country, producing details on landforms, lakes/rivers, forests, roads and railways, etc.
- the NTS is split into three major zones: "Southern zone" - latitudes between 40°N and 68°N, "Arctic zone" - latitudes between 68°N and 80°N, and the "High Arctic zone" - latitudes between 80°N and 88°N
- an NTS map number consists of a string containing a number identifying a map sheet, a letter identifying a map area, and a number identifying the scale map sheet
- likewise, the first result will be a location of the NTS map number, click to center map on this area
- example: type in **030M13**

#### Unsupported Search Types

**Street address**: Search using direct street addresses is not supported by Geosearch.
- entering any valid street address should not return any results

### Geosearch Filters:

The row of options immediately below the search bar contains two dropdown boxes that allow you to filter the search results by their **province** (Alberta, British Columbia, Ontario, etc.) and/or **type** (lake, town, river, etc.). To the right of these two filters is a **Clear Filters** button, which clears all existing selected filter options.

![](./images/geosearch-top-filters.png)

Near the bottom of the Geosearch panel, there is a checkbox labeled **visible on map**. Checking this box will filter the results to only show locations that are visible in the current map extent. Moving the map around or zooming in/out with this box selected will be reflected by updating the results to display locations within the new map extent.

![](./images/geosearch-bottom-filters.png)

### Geosearch Results:

When searching for a location, a list of matched results with all appropriate filters applied (map extent, province, type) will be displayed. This takes up the main body of the Geosearch panel. There is an upper limit of 100 results possible to be displayed. If no matching results are found, then a message will appear in place of the results to inform the users.

![](./images/geosearch-results.png)