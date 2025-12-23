
/**
 * Extracts frames from a video at specific intervals.
 */
export const extractFrames = async (videoFile: File, intervalSeconds: number = 1, maxFrames: number = 15): Promise<{data: string; timestamp: number}[]> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.src = URL.createObjectURL(videoFile);
    video.load();

    const frames: {data: string; timestamp: number}[] = [];
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    video.onloadedmetadata = () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      let currentTime = 0;
      const duration = video.duration;

      const capture = () => {
        if (currentTime <= duration && frames.length < maxFrames) {
          video.currentTime = currentTime;
        } else {
          resolve(frames);
        }
      };

      video.onseeked = () => {
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
          frames.push({
            data: dataUrl.split(',')[1], // Just base64 part
            timestamp: currentTime
          });
          currentTime += intervalSeconds;
          capture();
        }
      };

      capture();
    };

    video.onerror = (e) => reject(e);
  });
};
