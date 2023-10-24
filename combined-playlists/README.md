# Playlist combiner
Ever wanted to combine your spotify playlists into one big one? This Spicetify custom app is able to do just that.  

### Features
* Combine multiple playlists into one
* Auto sync to add missing tracks when spotify starts

![combined playlists home page](docs/home.png)

<details>
<summary>Create and edit dialogs</summary>

![combined playlists create page](docs/create.png)
![combined playlists edit page](docs/edit.png)
</details>

## Installation
Download the folder from the [dist branch](https://github.com/jeroentvb/spicetify-combined-playlists/tree/dist). Extract and copy the folder named `combined-playlists` (*not* the folder named `spicetify-combined-playlists-dist`) to the spicetify CustomApps folder located in:
| **Platform**    | **Path**                               |
|-----------------|----------------------------------------|
| **MacOs/Linux** | `~/.config/spicetify/CustomApps`       |
| **Windows**     | `%appdata%\spicetify\CustomApps`       |

Then, run the following commands:
```sh
spicetify config custom_apps combined-playlists
spicetify apply
```

## Usage
Create a combined playlist using the `Create playlist` card, or using the `add` button in the top right corner. Only playlists you own, or have liked can be selected to create a combined playlist.

Combined playlists can be updated/synchronized by clicking the button on the card, or by opening the edit modal and pressing save.

Playlists may also be added or removed via the edit modal. Removing a playlist doesn't remove all songs from that playlist from the combined playlist. It only ensures new songs from that playlist won't be added to the combined playlist on future sync attempts.

```
⚠️ Combining a large amount of songs into a playlist may take some time
```
