import React from 'react'
import Header from '../../components/Header/Header'
import Landingpagecont1 from '../../components/Landingpagecont1/Landingpagecont1'
import Landingpagecont2 from '../../components/Landingpagecont2/Landingpagecont2'
import Landingpagecont3 from '../../components/Landingpagecont3/Landingpagecont3'
import Landingpagecont4 from '../../components/Landingpagecont4/Landingpagecont4'
import Landingpagecont5 from '../../components/Landingpagecont5/Landingpagecont5'
import Footer from '../../components/Footer/Footer'

const Landingpage = () => {
  return (
    <div>
      <Header/>
      <Landingpagecont1/>
      <Landingpagecont2/>
      <Landingpagecont3/>
      <Landingpagecont4/>
      <Landingpagecont5/>
      <Footer/>
    </div>
  )
}

export default Landingpage