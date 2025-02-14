import React from 'react'
import Image from 'next/image';
import styles from "./page.module.css"

function page() {
  return (
    <div className={styles.main}>
        <Image
        src="/linda.jpg"
        alt="Linda Atkinson"
        width={428}
        height={450}
        layout="intrinsic"
      />
    </div>    
  )
}

export default page