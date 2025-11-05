// Script de test pour récupérer les noms de programmes TimeOne
const TIMEONE_PARTID = '64040'
const TIMEONE_API_KEY = 'a4f8ffae42da880da36a26a1d1f4574d'

// Test 1: Récupérer les programmes
async function testPrograms() {
  const url = `https://publisher.performance.timeone.io/xmlProgAff.php?partid=${TIMEONE_PARTID}&key=${TIMEONE_API_KEY}`
  
  console.log('🔍 Récupération des programmes TimeOne...\n')
  console.log('URL:', url, '\n')
  
  try {
    const response = await fetch(url)
    const xml = await response.text()
    
    // Afficher un extrait du XML pour debug
    console.log('📄 Extrait XML (premiers 500 caractères):\n')
    console.log(xml.substring(0, 500))
    console.log('\n...\n')
    
    // Extraire les noms de programmes
    const programRegex = /<program[^>]*id="([^"]*)"[^>]*>([\s\S]*?)<\/program>/gi
    const matches = xml.matchAll(programRegex)
    
    console.log('📋 PROGRAMMES TIMEONE TROUVÉS:\n')
    console.log('─'.repeat(60))
    
    let count = 0
    for (const match of matches) {
      const programId = match[1]
      const programContent = match[2]
      
      const nameMatch = programContent.match(/<program_name><!\[CDATA\[(.*?)\]\]><\/program_name>/i)
      const name = nameMatch ? nameMatch[1].trim() : 'Sans nom'
      
      const statusMatch = programContent.match(/<status[^>]*>([^<]+)<\/status>/i)
      const status = statusMatch ? statusMatch[1].trim() : 'Inconnu'
      
      count++
      console.log(`${count}. ${name}`)
      console.log(`   ID: ${programId} | Statut: ${status}`)
      console.log()
    }
    
    console.log('─'.repeat(60))
    console.log(`\n✅ Total: ${count} programmes\n`)
    
  } catch (error) {
    console.error('❌ Erreur:', error.message)
  }
}

// Test 2: Récupérer les actions des 90 derniers jours (TOUS les statuts)
async function testActions() {
  const endDate = new Date().toISOString().split('T')[0]
  const startDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  
  // s=3 pour TOUS les statuts (0=refusé, 1=en attente, 2=approuvé, 3=tous)
  const url = `http://api.publicidees.com/subid.php5?k=${TIMEONE_API_KEY}&p=${TIMEONE_PARTID}&dd=${startDate}&df=${endDate}&s=3&td=a`
  
  console.log('🔍 Récupération des actions TimeOne (90 derniers jours - TOUS statuts)...\n')
  console.log('Période:', startDate, '→', endDate, '\n')
  
  try {
    const response = await fetch(url)
    const xml = await response.text()
    
    // Compter les actions
    const actionRegex = /<action([^>]*)\/>/gi
    const matches = [...xml.matchAll(actionRegex)]
    
    console.log('📊 ACTIONS TROUVÉES:\n')
    console.log('─'.repeat(60))
    console.log(`Total actions: ${matches.length}\n`)
    
    if (matches.length > 0) {
      console.log('Détails des 5 premières actions:\n')
      
      matches.slice(0, 5).forEach((match, i) => {
        const attrs = match[1]
        const getId = (attr) => {
          const m = attrs.match(new RegExp(`${attr}="([^"]*)"`, 'i'))
          return m ? m[1] : 'N/A'
        }
        
        console.log(`${i + 1}. Action ID: ${getId('id')}`)
        console.log(`   Date: ${getId('ActionDate')}`)
        console.log(`   Commission: ${getId('ActionCommission')}€`)
        console.log(`   Panier: ${getId('CartAmount')}€`)
        console.log(`   Programme ID: ${getId('ProgramID')}`)
        console.log()
      })
    }
    
    console.log('─'.repeat(60))
    
  } catch (error) {
    console.error('❌ Erreur:', error.message)
  }
}

// Exécuter les tests
console.log('\n' + '='.repeat(60))
console.log('  TEST API TIMEONE')
console.log('='.repeat(60) + '\n')

testPrograms().then(() => {
  console.log('\n' + '='.repeat(60) + '\n')
  return testActions()
}).then(() => {
  console.log('\n' + '='.repeat(60))
  console.log('  FIN DES TESTS')
  console.log('='.repeat(60) + '\n')
})
