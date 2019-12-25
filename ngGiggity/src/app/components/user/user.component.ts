import { ActiveBidPipe } from './../../pipes/active-bid.pipe';
import { JobService } from 'src/app/services/job.service';
import { UserService } from './../../services/user.service';
import { Component, OnInit } from '@angular/core';
import { UserSkill } from 'src/app/models/user-skill';
import { UserSkillService } from 'src/app/services/user-skill.service';
import { Job } from 'src/app/models/job';
import { Router } from '@angular/router';
import { Skill } from 'src/app/models/skill';
import { User } from 'src/app/models/user';
import { BidService } from 'src/app/services/bid.service';
import { Bid } from 'src/app/models/bid';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  title = 'Profile';
  userSelected = null;
  userSkills: UserSkill[] = [];
  updateGig: Job = null;
  selected: Job = null;
  userJobs: Job[];
  skillName: string;
  skills: Skill[];
  user: User;
  bids: Bid[];
  // tslint:disable-next-line: max-line-length

  constructor(private bidSvc: BidService, private userSvc: UserService, private userSkillSvc: UserSkillService,
              private jobSvc: JobService, private router: Router, private activeBid: ActiveBidPipe) {
    // //reloads current URL with new search term
    // this.navigationSubscription = this.router.events.subscribe(
    //   (e: any) => {
    //     if (e instanceof NavigationEnd) {
    //       console.log("Inside instanceOf NavigationEnd");
    //       this.keyword = this.currentRoute.snapshot.paramMap.get('skillName');
    //       if (this.keyword) {
    //         this.jobSvc.findJobBySkill(this.keyword).subscribe(
    //           data => {
    //             this.selected = data.find(this.checkSkill)


    //           },
    //           err => {

    //           }
    //         );

    //       }
    //     }
    //   }
    // );
  }

  remove(job: Job) {
    job.active = false;
    this.update(job);
  }

  displaySelected(job) {
    this.selected = job;
  }

  setUpdateGig(job: Job) {
    this.selected = job;
    this.updateGig = Object.assign({}, job);
    console.log(this.updateGig);
  }

  update(job: Job) {
    this.jobSvc.update(job.id, job).subscribe(
      data => {
        console.error('HEY I\'M IN UPDATE WITH DATA');
        // this.router.navigateByUrl('search/' + job.skill.name);
        // this.router.navigateByUrl('#/user');
        this.ngOnInit();

        this.updateGig = null;
      },
      err => {
        console.error('Update error in Compnent');
      });
  }
  ngOnInit() {
    this.userSvc.getUserByUsername().subscribe(
      data => {
        this.userSelected = data;
      },
      err => console.error('Reload error in Component')
      );
    this.getUserJobs();
    this.getUserSkills();
  }

    getUserJobs() {
    this.userSvc.getJobsByUsername().subscribe(
      data => {
        console.log(data);
        this.userJobs = data;
      },
      err => console.error('Reload error in Component')
      );
    }

    getUserSkills() {
    this.userSvc.getSkillsByUsername().subscribe(
      data => {
        this.userSkills = data;
      },
      err => console.error('Reload error in Component')
    );
    }

  getSkillName(id) {
    this.userSkillSvc.findSkillName(id).subscribe(
      data => {
        console.log('--------------------------');
        console.log(data);
        this.skillName = data.name;
      }
    );
  }

  showBids(job: Job){
    this.selected = job;
    this.bids = job.jobBids;
  }

  hideBids(){
    this.bids = null;
  }



}
