# 3D Web Archeological Site Viewer

Made with THREE JS, in VSCode and Blender.

#### Installation

-   download in a folder
-   run "npm install" and "npm run dev" in said folder
-   ctrl-click on the link to open the website

#### Camera Controls

-   left click to rotate,
-   right click to pan
-   scroll to zoom
-   ctrl-click to select a finding and hide all other objects
-   ctrl-click again to return to main view.

#### Other controls:

-   x to hide the top visible layer
-   z to revert.

#### Dummy data

-   _Findings.json_ contains an array with each element containing the position and rotation (in Vector3 format) and mesh data for each finding.
-   _SiteSection.json_ contains the scale of the section in Vector3 format on a line, and on the next line the number of layers.
