const video = document.querySelector("#stream") as HTMLVideoElement;
const button = document.querySelector("button") as HTMLButtonElement;
const streamURL =
  "http://192.168.68.9:1985/rtc/v1/whep/?app=live&stream=livestream";

async function play(stream: string) {
  const pc = new RTCPeerConnection({});

  pc.addEventListener("track", (e) => {
    video.srcObject = e.streams[0];
    video.play();
  });

  pc.addTransceiver("video", { direction: "recvonly" });
  pc.addTransceiver("audio", { direction: "recvonly" });

  const offer = await pc.createOffer();
  await pc.setLocalDescription(offer);

  const res = await fetch(stream, {
    method: "POST",
    headers: {
      "Content-Type": "application/sdp",
    },
    body: offer.sdp,
  });

  const answerSDP = await res.text();

  await pc.setRemoteDescription({
    type: "answer",
    sdp: answerSDP,
  });
}

button.addEventListener("click", () => {
  play(streamURL);
});
