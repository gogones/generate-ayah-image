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

                // The text from your JSON
                const text = item.data.text.arab;

                // Add text to canvas
                context.fillText(text, canvas.width / 2, canvas.height / 2);

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
                        <img src={d.image} width='500px' alt={d.data.text.arab} />
                    </div>
                )
          })}
      </div>
    </>
  )
}

export default App
