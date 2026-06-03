package com.yourcaryourway.chat.controller;

import com.yourcaryourway.chat.model.Utilisateur;
import com.yourcaryourway.chat.service.UtilisateurService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/utilisateurs")
@RequiredArgsConstructor
public class UtilisateurController {

    private final UtilisateurService utilisateurService;

    @PostMapping
    public Utilisateur create(@RequestBody Utilisateur utilisateur) {
        return utilisateurService.create(utilisateur);
    }

    @GetMapping
    public List<Utilisateur> findAll() {
        return utilisateurService.findAll();
    }
}