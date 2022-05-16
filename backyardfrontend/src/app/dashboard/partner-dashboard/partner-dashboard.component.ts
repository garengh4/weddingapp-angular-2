import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Backyard } from "src/app/shared/entity/Backyard";
import { Partner } from "src/app/shared/entity/Partner";
import { PartnerDashboardService } from "./partner-dashboard.service";

@Component({
  selector: "partner-dashboard",
  templateUrl: './partner-dashboard.component.html'
})

export class PartnerDashboardComponent implements OnInit {
  errMsg: string;
  successMsg: string;

  constructor(
    private partnerDashboardService: PartnerDashboardService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.getLoggedInPartner();
    this.getPartnerBackyards();

    this.createBackyardForm();
  }

  /* ====================================================================================================================================================== */
  loggedInPartner: Partner;
  backyardsInDB: Backyard[];

  public getLoggedInPartner() {
    this.loggedInPartner = JSON.parse(sessionStorage.getItem("loggedInPartner") || '{}') //some bug here in name 'loggedInPartner'
  }

  public getPartnerBackyards(): void {
    this.partnerDashboardService.getPartnerBackyards(this.loggedInPartner.partnerEmailId).subscribe(
      response => {
        this.backyardsInDB = response;
        // sessionStorage.setItem("backyard", JSON.stringify(this.backyardsInDB));
      }
    )
  }

  /* ====================================================================================================================================================== */
  addBackyardForm: FormGroup;
  newBackyard: Backyard = new Backyard;

  public createBackyardForm(): void {
    this.addBackyardForm = this.fb.group({
      backyardName: [this.newBackyard.backyardName, [Validators.required], null],
      backyardDescription: [this.newBackyard.backyardDescription, [Validators.required], null],
      backyardCity: [this.newBackyard.backyardCity, [Validators.required], null],
      backyardCost: [this.newBackyard.backyardCost, [Validators.required], null]
    })
  }

  public onAddBackyard(): void {
    this.errMsg = '';
    this.successMsg = '';
    this.newBackyard = this.addBackyardForm.value as Backyard;
    this.partnerDashboardService.addBackyardToPartner(this.loggedInPartner.partnerEmailId, this.newBackyard).subscribe({
      next: response => {
        this.newBackyard.partnerEmailId = this.loggedInPartner.partnerEmailId;
        this.successMsg = response;
        this.addBackyardForm.reset();
        this.getPartnerBackyards(); //updates partner backyard table immediately
      }, error: response => {
        console.log(response);
        this.errMsg = response;
      }
    })
  }

  /* ====================================================================================================================================================== */
  toBeDeletedBackyard: Backyard = new Backyard;

  public onDeleteBackyard(toBeDeletedBackyard: Backyard): void {
    this.partnerDashboardService.deletePartnerBackyard(toBeDeletedBackyard.partnerEmailId,toBeDeletedBackyard.backyardId).subscribe({
      next: response => {
        this.successMsg = response;
        this.getPartnerBackyards(); //updates table when delete
      }, 
      error: response => {
        this.errMsg = response;
        console.log(response);
      }
    })
  }
  
  /* ====================================================================================================================================================== */
  // modal section
  displayStyle = "none";
  
  openPopup() {
    this.displayStyle = "block";
  }
  closePopup() {
    this.displayStyle = "none";
  }


}

