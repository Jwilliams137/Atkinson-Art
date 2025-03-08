import React from 'react'
import styles from './page.module.css'

function page() {
  return (
    <div className={styles.container}>
      <form action="https://formsubmit.co/jwilliams137.036@gmail.com" method="POST" className={styles.form}>
        <input 
          type="text" 
          name="name" 
          placeholder="Your Name" 
          required 
          className={styles.inputField} 
        />
        <input 
          type="email" 
          name="email" 
          placeholder="Your Email" 
          required 
          className={styles.inputField} 
        />
        <textarea 
          name="message" 
          placeholder="Your Message" 
          required 
          className={styles.textarea}
        ></textarea>
        <input type="hidden" name="_next" value="https://atkinson-art.netlify.app/thank-you" className={styles.hidden} />
        <input type="hidden" name="_subject" value="New message from your website visitor" className={styles.hidden} />
        <input type="hidden" name="_honey" className={styles.hidden} />
        <button type="submit" className={styles.button}>Send Message</button>
      </form>
    </div>
  )
}

export default page