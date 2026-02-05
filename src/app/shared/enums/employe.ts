export class Employe {
    id: string; // ou matricule si c'est votre clé primaire
    firstName: string;
    lastName: string;
    email: string;
    matricule: string;
    direction: string;

    constructor(data?: Partial<Employe>) {
        if (data) {
            Object.assign(this, data);
        }
    }
}
