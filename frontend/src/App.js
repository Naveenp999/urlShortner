import {useState} from 'react'
import AnalyticsTab from './components/AnalyticsTab'
import ShortUrlTab from './components/ShortUrlTab'
import './App.css'

const App = () => {
  const [tab,setTab] = useState('shorturl');

  return(
    <div className="main-container">
      <div className="Tab-container">
        <button className={`tab-btn ${tab==='shorturl' && 'active'}`} 
        onClick = {() => setTab('shorturl')}>Short URL</button>
        <button className={`tab-btn ${tab==='analytics' && 'active'}`} 
        onClick = {() => setTab('analytics')}>Analytics</button>
      </div>
      {tab === 'shorturl' ? <ShortUrlTab/> : <AnalyticsTab/>}
    </div>
  )
}

export default App;
