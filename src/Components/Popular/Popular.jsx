import React from 'react'
import './Popular.css'
import Item from '../Item/Item'

const Popular = (props) => {
  return (
    <div className='popular'>
      <div className="popular-header">
        <h1>Produit Populaire</h1>
        <p className="popular-subtitle">Découvrez notre sélection de produits les plus appréciés</p>
      </div>
      <div className="popular-item">
        {props.data.map((item,index)=>{
            return <Item id={item.id} key={index} name={item.name} image={item.image}  new_price={item.new_price} old_price={item.old_price}/>
        })}
      </div>
    </div>
  )
}

export default Popular
