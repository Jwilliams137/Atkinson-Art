import React from 'react'
import Image from 'next/image';
import styles from "./page.module.css"

function page() {
  return (
    <div className={styles.main}>
        <h2>About</h2>
        <Image
        src="/linda.jpg"  // Path to your image
        alt="Linda Atkinson"
        width={428}                    // Desired width
        height={450}                   // Desired height
        layout="intrinsic"             // Use "intrinsic" for responsive images
      />
    </div>
    
  )
}

export default page