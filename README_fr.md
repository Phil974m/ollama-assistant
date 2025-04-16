<<<<<<< HEAD
# ollama-assistant
=======
# Ollama Assistant for VS Code

![Banner](https://user-images.githubusercontent.com/.../banner.png) *(optionnel: ajoutez une image si disponible)*

Extension VS Code qui intègre les modèles Ollama locaux pour une assistance au développement similaire à Copilot, avec un contrôle total sur vos données.

## ✨ Fonctionnalités

- **Complétion intelligente** : Suggestions de code en temps réel
- **Génération de code** : Via commande dédiée (`Ctrl+Shift+P > Generate Code`)
- **Chat interactif** : Interface conversationnelle intégrée
- **Multi-modèles** : Support de tous les modèles Ollama (CodeLlama, Mistral, etc.)
- **Exécution locale** : Aucune donnée envoyée au cloud

## 🚀 Installation

1. Installer [Ollama](https://ollama.ai) et démarrer le service :
   
   curl -fsSL https://ollama.ai/install.sh | sh
   ollama serve
   
    Télécharger un modèle (ex: CodeLlama) :

    ollama pull codellama

    Installer l'extension dans VS Code :

        Via le marketplace (recommandé)
        Recherchez "Ollama Assistant"

        Manuellement :
        
        npm install
        npm run compile
        vsce package
        code --install-extension ollama-assistant-0.0.1.vsix

⚙️ Configuration

Accédez aux paramètres (Ctrl+,) et recherchez "Ollama" :

    Endpoint : http://localhost:11434 (par défaut)

    Default Model : codellama (modifiable)

🎯 Utilisation
Complétion automatique

Commencez à taper pour voir les suggestions générées par le modèle.

Commandes principales

Commande	Raccourci	Description
Generate Code	Ctrl+Alt+G	Génère du code depuis un prompt
Open Chat	Ctrl+Alt+C	Ouvre le panneau de chat
Barre d'état

    Affiche le modèle actif

    Cliquez pour changer de modèle

🛠 Développement

Contributions bienvenues ! Voici comment configurer l'environnement :

git clone https://github.com/Phil974/ollama-assistant.git
cd ollama-assistant
npm install
npm run watch  # Compilation en temps réel

📜 Licence

MIT - Lire la licence sur https://mit-license.org/

    Note : Cette extension nécessite Ollama v0.1.0+. Pour mettre à jour: 

    ollama --version # pour connaitre la version d'ollama
>>>>>>> 18ff6b1 (Initial commit)
