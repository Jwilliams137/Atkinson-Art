import styles from './page.module.css';

function ContactPage() {
  const phoneNumber = '+5403128463';
  const email = 'linda.atkinson111@gmail.com';

  return (
    <div className={styles.container}>
      <h1 className={styles.visuallyHidden}>Contact Linda Atkinson</h1>

      <form
        action="https://formsubmit.co/Linda.atkinson111@gmail.com"
        method="POST"
        className={styles.form}
      >
        <label htmlFor="name" className={styles.visuallyHidden}>
          Your Name
        </label>
        <input
          id="name"
          type="text"
          name="name"
          placeholder="Your Name"
          required
          className={styles.inputField}
        />

        <label htmlFor="email" className={styles.visuallyHidden}>
          Your Email
        </label>
        <input
          id="email"
          type="email"
          name="email"
          placeholder="Your Email"
          required
          className={styles.inputField}
        />

        <label htmlFor="message" className={styles.visuallyHidden}>
          Your Message
        </label>
        <textarea
          id="message"
          name="message"
          placeholder="Your Message"
          required
          className={styles.textarea}
        ></textarea>

        <input
          type="hidden"
          name="_next"
          value="https://atkinson-art.netlify.app/thank-you"
          className={styles.hidden}
        />
        <input
          type="hidden"
          name="_subject"
          value="New message from your website visitor"
          className={styles.hidden}
        />
        <input type="hidden" name="_honey" className={styles.hidden} />

        <button type="submit" className={styles.button}>
          Send Message
        </button>
      </form>

      <div className={styles.contactInfo}>
        <p>
          <a href={`mailto:${email}`} className={styles.contactLink}>
            {email}
          </a>
        </p>
        <p>
          <a href={`tel:${phoneNumber}`} className={styles.contactLink}>
            540-312-8463
          </a>
        </p>
      </div>
    </div>
  );
}

export default ContactPage;