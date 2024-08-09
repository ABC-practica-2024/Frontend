# 3D Web preview
## Made with THREE JS, in VSCode and Blender.
* Camera Controls: left click to rotate, right click to pan, scroll to zoom, ctrl-click to select a finding and hide all other objects, ctrl-click again to return to main view.
* Other controls: x to hide the top visible layer, z to revert.
* Installation: download in a folder, then run in terminal "npm install" and "npm run dev" in said folder; ctrl-click on the link to open the website.
* Findings.txt contains position, scale, rotation (all in Vector3 format) and color(in hexadecimal format) in 4 lines per each object. 
* SiteSection.txt contains the scale of the section in Vector3 format on a line, and on the next line the number of layers.
* X to hide layers, Z to show them (this does not work in focus view). Layers and focus mode do not interfere with each other.