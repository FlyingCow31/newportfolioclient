export function GeneratePassword() {
     let result = ""
     // TODO: Put this in .env
     const characters = "A1BC7DEFGHI3JK2LMNOPQRSTU4VWXYZabc6d5efgh9ijklmnopqrstuvw8xyz"
     const charactersLength = characters.length

     for (let i = 0; i < 10; i++) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength))
     }
     return result
}
