package com.qualite.suivi.model;

import lombok.Data;
import lombok.EqualsAndHashCode;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;
import java.util.List;

@Document(collection = "projets")
@Data
@EqualsAndHashCode(callSuper = true)
public class Projet extends AbstractAuditEntity {
    @Id
    private String id;
    private String nomProjet;
    private String description;
    private String objectifs;
    private Date dateDebut;
    private Date dateFinPrevue;
    private String statut; // from nomenclature

    @DBRef
    private Utilisateur chefDeProjet;

    @DBRef
    private List<FicheProjet> fichesProjet;

    @DBRef
    private List<FicheSuivi> fichesSuivi;

    @DBRef
    private List<KPI> kpis;

    private Integer avancement; // %
    private Integer kpiGlobal;
}
