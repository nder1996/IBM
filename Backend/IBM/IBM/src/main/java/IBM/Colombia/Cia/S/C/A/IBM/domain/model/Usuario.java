package IBM.Colombia.Cia.S.C.A.IBM.domain.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Date;
import java.util.List;

@Entity
//@Table(name = "Usuario")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Usuario implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name="nombre",nullable = false)
    private String nombre;

    @Column(name="password",nullable = false)
    private String password;

    @Column(name="email",nullable = false, unique = true)
    private String email;

    @Column(name="estado")
    private String estado;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name="createAt")
    private Date createAt;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name="updateAt")
    private Date updateAt;
    
    @Column(name="profilePhoto")
    private String profilePhoto;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of();
    }

    @Override
    public String getUsername() {
        return "";
    }
}