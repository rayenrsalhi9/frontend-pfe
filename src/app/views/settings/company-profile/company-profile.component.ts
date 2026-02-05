import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SecurityService } from '@app/core/security/security.service';
import { CompanyProfile } from '@app/shared/enums/company-profile';
import { CommonService } from '@app/shared/services/common.service';
import { CompanyProfileService } from '@app/shared/services/company-profile.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-company-profile',
  templateUrl: './company-profile.component.html',
  styleUrls: ['./company-profile.component.css']
})
export class CompanyProfileComponent implements OnInit {

  companyProfileForm: FormGroup;
  imgSrc: string | ArrayBuffer = '';
  bannerSrc: string | ArrayBuffer = '';
  isLoading = false;
  //currencies: Currency[] = [];
  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private companyProfileService: CompanyProfileService,
    private router: Router,
    private toastrService: ToastrService,
    private securityService: SecurityService,
    private cdr:ChangeDetectorRef,
    private commonService: CommonService,
    private translate: TranslateService) {
    // this.getLangDir();
  }

  ngOnInit(): void {
    this.createform();
    this.getCurrencies();
    this.companyProfileService.getCompanyProfile().subscribe(
      (data:any)=>{
        this.companyProfileForm.patchValue(data);
        if (data.logoUrl) {
          this.imgSrc = environment.apiUrl + data.logoUrl;
        }
        if (data.bannerUrl) {
          this.bannerSrc = environment.apiUrl + data.bannerUrl;
        }
        this.cdr.markForCheck()
      }
    )
    this.cdr.detectChanges()
  }

  createform() {
    this.companyProfileForm = this.fb.group({
      id: [''],
      title: ['', [Validators.required]],
      logoUrl: [''],
      imageData: [],
      phoneNumber:[],
      address:[],
      email:[],
      description:[],
      facebook:["#facebook"],
      twitter:["#twitter"],
      linkedin:["#linkedin"],
      bannerUrl: [''],
      bannerData: ['']
    });
  }

  getCurrencies() {
    // this.commonService.getCurrencies().subscribe(data => this.currencies = data);
  }

  saveCompanyProfile() {
    if (this.companyProfileForm.invalid) {
      this.companyProfileForm.markAllAsTouched();
      return
    }
    const companyProfile: CompanyProfile = this.companyProfileForm.getRawValue();
    this.isLoading = true;
    this.companyProfileService.updateCompanyProfile(companyProfile)
      .subscribe((companyProfile: CompanyProfile) => {
        if (companyProfile.languages) {
          companyProfile.languages.forEach(lan => {
            lan.imageUrl = `${environment.apiUrl}${lan.imageUrl}`;
          })
        }
        this.isLoading = false;
        this.companyProfileService.refreshCompanyProfile(companyProfile)
        this.securityService.updateProfile(companyProfile);
        this.translate.get('COMPANY.PROFILE.TOAST.COMPANY_PROFILE_UPDATED_SUCCESSFULLY').subscribe((translatedMessage: string) => {
          this.toastrService.success(translatedMessage);
        });
        this.router.navigate(['dashboard']);
      }, () => this.isLoading = false);
  }

  onFileSelect($event) {
    const fileSelected: File = $event.target.files[0];
    if (!fileSelected) {
      return;
    }
    const mimeType = fileSelected.type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(fileSelected);
    reader.onload = (_event) => {
      this.imgSrc = reader.result;
      this.companyProfileForm.patchValue({
        imageData: reader.result.toString(),
        logoUrl: fileSelected.name
      })
      $event.target.value = '';
      this.cdr.detectChanges()
    }
  }

  onBannerChange($event) {
    const fileSelected: File = $event.target.files[0];
    if (!fileSelected) {
      return;
    }
    const mimeType = fileSelected.type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(fileSelected);
    reader.onload = (_event) => {
      this.bannerSrc = reader.result;
      this.companyProfileForm.patchValue({
        bannerData: reader.result.toString(),
        bannerUrl: fileSelected.name
      })
      $event.target.value = '';
      this.cdr.detectChanges()
    }
  }
}
