import React from 'react'

function SidebarItem({ name, active, handleClick }) {
  return (
    <button 
      // if active is true, return active class; else return empty string
      className={`sidebar-item ${active ? 'active' : ''}`}
      onClick={handleClick}
    >{ name }
    </button>
  )
}
export default SidebarItem;