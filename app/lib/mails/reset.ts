import nodemailer from "nodemailer"

const SMTP_PORT = Number(process.env.SMTP_PORT ?? 465)

if (!process.env.SMTP_HOST || !Number.isInteger(SMTP_PORT) || SMTP_PORT <= 0) {
     throw new Error("SMTP configuration is missing or invalid.")
}

const transporter = nodemailer.createTransport({
     host: process.env.SMTP_HOST,
     port: SMTP_PORT,
     secure: SMTP_PORT === 465,
     connectionTimeout: 10_000,
     greetingTimeout: 10_000,
     socketTimeout: 10_000,
     auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
     },
})

type FirstLoginMail = {
     prenom: string
     email: string
     password: string
     expiration?: string
}

export default async function ResetMail({ prenom, email, password }: FirstLoginMail): Promise<void> {
     try {
          await transporter.sendMail({
               from: '"Gaël Tournier" <no-reply@gaeltournier.dev>',
               to: email,
               ...firstLoginMail({ prenom: prenom, email: email, password: password }),
          })
     } catch (err) {
          const message = err instanceof Error ? err.message : "SMTP request failed."
          console.error("Mail error:", message)
          throw new Error(`Impossible d'envoyer l'e-mail : ${message}`)
     }
}

const escapeHtml = (value: string) =>
     value
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;")
          .replace(/'/g, "&#39;")

export function firstLoginMail({ prenom, email, password, expiration = "7 jours" }: FirstLoginMail) {
     const url = "https://panel.gaeltournier.dev/reset"

     const subject = "Vos accès à votre espace client"

     const text = `Bonjour ${prenom},

Votre espace client est prêt : vous pouvez y suivre l'avancée de votre projet, retrouver vos documents et vos factures.

E-mail de connexion : ${email}
Mot de passe provisoire : ${password}

Connectez-vous ici pour choisir votre propre mot de passe :
${url}

Le mot de passe provisoire est valable ${expiration} et ne fonctionnera plus ensuite.

Pour votre sécurité, ne transférez pas cet e-mail.

Gaël Tournier EI · Développement web`

     const html = `<!doctype html>
<html lang="fr" xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="x-apple-disable-message-reformatting">
<meta name="color-scheme" content="light">
<meta name="supported-color-schemes" content="light">
<title>Vos accès à votre espace client</title>
<style>
@media (max-width: 620px) {
  .container { width: 100% !important; }
  .pad { padding: 24px !important; }
  .title { font-size: 26px !important; }
  .btn a { display: block !important; }
}
</style>
</head>
<body style="margin: 0; padding: 0; background: #C4A1FF; -webkit-text-size-adjust: 100%;">
<div style="display: none; max-height: 0; overflow: hidden; mso-hide: all;">Vos identifiants pour accéder au suivi de votre projet.</div>

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background: #C4A1FF;">
<tr>
<td align="center" style="padding: 40px 16px;">

<table role="presentation" class="container" width="560" cellpadding="0" cellspacing="0" border="0" style="width: 560px; max-width: 560px;">

<tr>
<td style="padding: 0 0 16px 0; font-family: 'Arial Black', Arial, sans-serif; font-size: 18px; color: #111111;">
Panel · Gaël Tournier
</td>
</tr>

<tr>
<td style="background: #111111; padding: 0 8px 8px 0;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background: #F3ECFF; border: 3px solid #111111;">
<tr>
<td class="pad" style="padding: 36px; font-family: Arial, Helvetica, sans-serif; color: #111111;">

<h1 class="title" style="margin: 0 0 20px 0; font-family: 'Arial Black', Arial, sans-serif; font-size: 30px; line-height: 1.1; color: #111111;">Bienvenue sur votre espace client.</h1>

<p style="margin: 0 0 16px 0; font-size: 16px; line-height: 1.6;">Bonjour ${escapeHtml(prenom)},</p>
<p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.6;">Votre espace client est prêt : vous pouvez y suivre l'avancée de votre projet, retrouver vos documents et vos factures. Voici vos identifiants de première connexion.</p>

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 0 0 28px 0;">
<tr>
<td style="background: #FFFFFF; border: 2px solid #111111; padding: 16px 18px;">
<p style="margin: 0 0 4px 0; font-size: 12px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: #5E1F7D;">E-mail de connexion</p>
<p style="margin: 0 0 16px 0; font-size: 16px; font-weight: 700; word-break: break-all; color: #111111;">${escapeHtml(email)}</p>
<p style="margin: 0 0 6px 0; font-size: 12px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: #5E1F7D;">Mot de passe provisoire</p>
<p style="margin: 0; display: inline-block; background: #E2D0FF; border: 2px dashed #111111; padding: 8px 12px; font-family: 'Courier New', Courier, monospace; font-size: 20px; font-weight: 700; letter-spacing: 0.08em; word-break: break-all; color: #111111;">${escapeHtml(password)}</p>
</td>
</tr>
</table>

<table role="presentation" class="btn" cellpadding="0" cellspacing="0" border="0">
<tr>
<td style="background: #9723C9; padding: 0 4px 4px 0;">
<a href="${url}" target="_blank" style="display: inline-block; background: #111111; border: 3px solid #111111; padding: 14px 26px; font-family: Arial, Helvetica, sans-serif; font-size: 16px; font-weight: 700; color: #FFFFFF; text-decoration: none; text-align: center;">Me connecter et choisir mon mot de passe</a>
</td>
</tr>
</table>

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 28px 0 0 0;">
<tr>
<td style="background: #FFFFFF; border: 2px solid #111111; padding: 14px 16px; font-size: 14px; line-height: 1.5; color: #111111;">
À votre première connexion, vous choisirez <strong>votre propre mot de passe</strong>. Le mot de passe provisoire est valable <strong>${expiration}</strong> et ne fonctionnera plus ensuite.
</td>
</tr>
</table>

<p style="margin: 24px 0 6px 0; font-size: 14px; line-height: 1.5; color: #5E1F7D;">Le bouton ne fonctionne pas ? Copiez ce lien dans votre navigateur :</p>
<p style="margin: 0 0 24px 0; font-size: 14px; line-height: 1.5; word-break: break-all;"><a href="${url}" target="_blank" style="color: #9723C9; font-weight: 700;">${url}</a></p>

<p style="margin: 0; padding: 16px 0 0 0; border-top: 2px dashed #111111; font-size: 14px; line-height: 1.5; color: #5E1F7D;">Pour votre sécurité, ne transférez pas cet e-mail. Vous ne pensiez pas recevoir ce message ? Ignorez-le simplement.</p>

</td>
</tr>
</table>
</td>
</tr>

<tr>
<td style="padding: 20px 4px 0 4px; font-family: Arial, Helvetica, sans-serif; font-size: 12px; line-height: 1.5; color: #111111;">
Gaël Tournier EI · Développement web<br>
Cet e-mail est envoyé automatiquement, merci de ne pas y répondre.
</td>
</tr>

</table>

</td>
</tr>
</table>
</body>
</html>`

     return { subject, text, html }
}
