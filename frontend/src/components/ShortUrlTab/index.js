import {useState,useRef} from 'react'
import './index.css'
const ShortUrlTab = () => {

  const [url, setUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [err, setErr] = useState('');
  const ref = useRef('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('http://localhost:5000/shorten', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ original_url: url }),
    });
    if (response.ok) {
      const data = await response.json();
      setShortUrl(data.short_url);
      ref.current = url;
      setUrl('');
      setErr('');
    } else {
      const { error } = await response.json();
      setShortUrl('');
      setErr(error);
    }
  };

  // Copy URL function
  const copyUrl = async (link) => {
    try {
      await window.navigator.clipboard.writeText(link);
      alert('link copied');
    } catch (error) {
      alert('link Not Copied');
    }
  }; 


    return(
        <div className='tab-container'>
            <h2 className="heading">Shorten a URL</h2>
            <form onSubmit={handleSubmit} className="form">
            <input
                type="text"
                placeholder="Enter URL"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="input"
            />
            <button type="submit" className="form-btn">Shorten URL</button>
            </form>

            {shortUrl && (
            <>
                <p className="sub-heading">Shortened URL:</p>
                <div className='urlContainer'>
                    <a href={shortUrl} target="_blank" rel="noopener noreferrer">{shortUrl}</a>
                    <button className="cpyBtn" onClick={() => copyUrl(shortUrl)}>Copy</button>
                </div>

                <p className="sub-heading">Original URL:</p>
                <div className='urlContainer'>
                    <a href={ref.current} target="_blank" rel="noopener noreferrer">{ref.current}</a>
                    <button className="cpyBtn" onClick={() => copyUrl(ref.current)}>Copy</button>
                </div>
            </>
            )}

            {err && <p className="errorText">{err}</p>}
        </div>
    )
}

export default ShortUrlTab;