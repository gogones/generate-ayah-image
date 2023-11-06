import {useEffect, useState} from 'react'
import './App.css'

function App() {
  const [data, setData] = useState([]);

    useEffect(() => {
        const fetchAll = async () => {
            const apis = Array.from({ length: 7 }, (_, index) => {
                return `https://quran-api-omega.vercel.app/surah/1/${index + 1}`
            });

            const responses = await Promise.all(apis.map(api => fetch(api)));

            return await Promise.all(responses.map(response => response.json()));
        };

        fetchAll().then(res => {
            const addImageToJsonResponse = res.map((item) => {
                function wrapText(context, text, x, y, maxWidth, lineHeight) {
                    var words = text.split(' ');
                    var line = '';

                    for(var n = 0; n < words.length; n++) {
                        var testLine = line + words[n] + ' ';
                        var metrics = context.measureText(testLine);
                        var testWidth = metrics.width;
                        if (testWidth > maxWidth && n > 0) {
                            context.fillText(line, x, y);
                            line = words[n] + ' ';
                            y += lineHeight;
                        }
                        else {
                            line = testLine;
                        }
                    }
                    context.fillText(line, x, y);
                }

                // Create a canvas element
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');

                // Set the size of the canvas
                canvas.width = 800; // width of the image
                canvas.height = 600; // height of the image

                // Set background color
                context.fillStyle = '#fff'; // white background
                context.fillRect(0, 0, canvas.width, canvas.height);

                // Set text properties
                context.fillStyle = '#000'; // black text
                context.font = '24px Arial';
                context.textAlign = 'center';

                // This code multiline text VV
                // The text from your JSON
                [
                    item.data.text.arab,
                    item.data.translation.id
                ].map((text, index) => {
                    // Calculate the starting Y position
                    const lineHeight = 30; // The height of each line
                    const startingY = canvas.height / 2 - (2 * lineHeight) / 2 + lineHeight / 2;

                    const currentY = startingY + index * lineHeight;

                    // Add text to canvas
                    wrapText(context, text, canvas.width / 2, currentY, canvas.width - 20, lineHeight);
                });
                // This code multiline text ^^

                // This code is for single line VV
                // const text = item.data.text.arab;

                // Add text to canvas
                // context.fillText(text, canvas.width / 2, canvas.height / 2);
                // This code is for single line ^^

                // Convert canvas to an image
                const imageUrl = canvas.toDataURL('image/png');

                return {
                    ...item,
                    image: imageUrl
                }
            });

            setData(addImageToJsonResponse);
        });
    }, []);

  return (
    <>
      <div style={{display: 'flex', flexDirection: 'column', gap: 8}}>
          {data.map((d, index) => {
                return (
                    <div key={index} style={{border: '1px dashed #fff'}}>
                        <p>{d.data.text.arab}</p>
                        <img src={d.image} alt={d.data.text.arab} />
                    </div>
                )
          })}
      </div>
    </>
  )
}

export default App
