package com.qualite.suivi.service;

import com.qualite.suivi.model.FicheSuivi;
import com.qualite.suivi.model.Projet;
import com.qualite.suivi.repository.FicheSuiviRepository;
import com.qualite.suivi.repository.ProjetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
public class FicheSuiviService {

    @Autowired
    private FicheSuiviRepository ficheSuiviRepository;

    @Autowired
    private ProjetRepository projetRepository;

    @Autowired
    private HistoriqueService historiqueService;

    public FicheSuivi addFicheSuivi(String projetId, FicheSuivi fiche) {
        Projet projet = projetRepository.findById(projetId)
                .orElseThrow(() -> new RuntimeException("Projet non trouvé"));

        fiche.setDateSaisie(new Date());
        fiche.setProjetId(projet.getId());
        fiche.setProjetNom(projet.getNomProjet());
        FicheSuivi saved = ficheSuiviRepository.save(fiche);

        if (projet.getFichesSuivi() == null) projet.setFichesSuivi(new ArrayList<>());
        projet.getFichesSuivi().add(saved);
        projetRepository.save(projet);

        historiqueService.logAction("FICHE_SUIVI", "CREATE", "Fiche suivi ajoutée pour le projet: " + projet.getNomProjet());
        return saved;
    }

    public List<FicheSuivi> getFichesSuiviByProjet(String projetId) {
        Projet projet = projetRepository.findById(projetId)
                .orElseThrow(() -> new RuntimeException("Projet non trouvé"));
        return projet.getFichesSuivi();
    }

    public List<FicheSuivi> getAllFichesSuivi() {
        return ficheSuiviRepository.findAll();
    }
}
