# 😶‍🌫️ Mojimap

Mojimap is a browser-based playground that infers emoji reactions based on your facial expressions—entirely client-side. Using [TensorFlow.js](https://github.com/tensorflow/tfjs-models/tree/master/face-landmarks-detection) and [MediaPipe](https://ai.google.dev/edge/mediapipe/solutions/vision/face_landmarker)’s lightweight vision models, it tracks your face and maps your expressions to emojis in real time.

Check out the playground [here](https://mojimap.netlify.app/)!
- For optimial performance please use a browser **other than Chrome**, Firefox and Safari seem to work great! Unsure why Chrome gets bogged down.


## 🚀 Features

- Real-time **face landmark detection**, using 478 points facial feature points
- Facial expression **classficiation** all happening **locally in your browser**
  - Blendshape model infers subtle muscle movements and expressions taking the 478 landmark points as input
- See currently supported expressions below:


### 🧠 Supported Expressions

| Expression                                       | Emoji                                                    |
|--------------------------------------------------|----------------------------------------------------------|
| Winking (match same eye as emoji)                | <img src="./src/emojis/winking.png" width="42" />        |
| Smirking with leaning eyes (match same as emoji) | <img src="./src/emojis/smirking.png" width="42" />       |
| Smiling (without teeth)                          | <img src="./src/emojis/smiling_closed.png" width="42" /> |
| Smiling (with teeth)                             | <img src="./src/emojis/smiling_teeth.png" width="42" />  | 
| Shocked                                          | <img src="./src/emojis/shocked.png" width="42" />        | 
| Rolling Eyes                                     | <img src="./src/emojis/rolling_eyes.png" width="42" />   |


## 📬 Feedback or Ideas?
🙌 Contributions, feedback, and emoji ideas are always welcome.

Got a cool idea? Found a bug? Feel free to reach out 😄

- 📧 [Email](mailto:tj.ayoub@gmail.com)
- 🌐 [Portfolio](https://www.tjoab.com/)
