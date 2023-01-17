import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { filter } from 'rxjs';
import { DatabaseService } from './../../services/database.service';
import { Component, ChangeDetectorRef, OnInit, ViewChild } from '@angular/core';
import SwiperCore, { A11y, Autoplay, Controller, Navigation, Pagination, Scrollbar, Thumbs, Virtual, Zoom } from 'swiper';
import { SwiperComponent } from 'swiper/angular';
import { FormControl, FormGroup, Validators } from '@angular/forms';
SwiperCore.use([
  Navigation,
  Pagination,
  Scrollbar,
  A11y,
  Virtual,
  Zoom,
  Autoplay,
  Thumbs,
  Controller
]);
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  [x: string]: any;
  scrollData: any[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  joindGroup: any[] = [
    {
      image: `https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwallpapercave.com%2Fwp%2FI5Z5F6d.jpg&f=1&nofb=1&ipt=6cd804d61106e1f3d63cd5a3752482c6d9f44df7f1ae59507aef424bb28c57ae&ipo=images`,
      title: 'Automobile Community',
      members: '10k Members',
      url: '#'
    },
    {
      image: `https://www.hdfcsales.com/blog/wp-content/uploads/2019/08/hdfc-study-abroad-loans-for-bright-future.jpg`,
      title: 'Study Abroad',
      members: '19k Members',
      url: '#'
    },
    {
      image: `https://www.greatkneighton.co.uk/images/mastheadimage/latest_news_edited_newspaper_rotated-horizontally.jpg`,
      title: 'Latest News Updates',
      members: '24k Members',
      url: '#'
    },
    {
      image: `https://itchronicles.com/wp-content/uploads/2021/04/Optimized-Agile-Project-Management-Illustration-from-Adobe-Stock-scaled.jpeg`,
      title: 'IT technology',
      members: '30k Members',
      url: '#'
    },
    {
      image: `https://static.wixstatic.com/media/5eae43_e566da8ac2834d5dbd23122f45b43a27~mv2.jpg/v1/fit/w_1000%2Ch_512%2Cal_c%2Cq_80/file.jpg`,
      title: 'Gaming Community',
      members: '5k Members',
      url: '#'
    },
    {
      image: `https://wallpapercave.com/wp/wp5205255.jpg`,
      title: 'Anime Community',
      members: '1m Members',
      url: '#'
    },
    {
      image: `https://postcron.com/en/blog/wp-content/uploads/2017/02/Quotefancy-791-3840x2160.jpg`,
      title: 'Motivational Group',
      members: '2k Members',
      url: '#'
    },
    {
      image: `http://www.pixelstalk.net/wp-content/uploads/2016/06/Technology-Image-HD.jpg`,
      title: 'Tech Community',
      members: '10k Members',
      url: '#'
    },
    {
      image: `https://ewm.swiss/application/files/4016/0396/6469/World_Wide_Web_EWM_Web_Design_Agency_.jpg`,
      title: 'Web Community',
      members: '105k Members',
      url: '#'
    },
    {
      image: `https://www.vyrazu.com/wp-content/uploads/2021/01/UI-UX-1.jpg`,
      title: 'UI/UX Community',
      members: '8k Members',
      url: '#'
    },

  ]
  videosData: any[] = []
  userData!: any;
  token: any = localStorage.getItem('token');
  slidesPerPageConfig = { slidesPerView: 4 }
  filterdPost!: any[];
  editProfile: FormGroup;
  constructor(private db: DatabaseService, private cd: ChangeDetectorRef, private modalService: NgbModal) {
    this.editProfile = new FormGroup({
      name: new FormControl('', Validators.required),
      bio: new FormControl('', Validators.required),
      phone: new FormControl('', [Validators.required, Validators.minLength(10)]),
      location: new FormControl(''),
      age: new FormControl('', [Validators.required, Validators.max(100), Validators.min(15)]),
      url: new FormControl(''),
    })
  }
  ngOnInit(): void {
    this.getUserData()
    this.getPhotosOrVideos()

  }
  coverUpload(event: any) {
    let file = event[0]
    console.log(file, "File");
    this.db.pushCoverToStorage(file, this.userData.uid).subscribe((url: any) => {
      console.log(url);
      this.db.updateUserData(this.token, 'coverImage', url).subscribe((res) => {
        this.getUserData()
      })
    })
  }
  profileUpload(event: any) {
    let file = event[0]
    console.log(file, "File");
    this.db.pushProfileToStorage(file, this.userData.uid).subscribe((url: any) => {
      console.log(url);
      this.db.updateUserData(this.token, 'profileImage', url).subscribe((res) => {
        this.getUserData()
        this.cd.detectChanges()
      })
    })
  }
  getUserData() {
    this.db.getUserData(this.token).subscribe((res) => {
      this.userData = res
      console.log(this.userData);
      localStorage.setItem('userData', JSON.stringify(res))
    })
  }
  getPhotosOrVideos() {
    this.db.getPosts().subscribe((res: any[]) => {
      console.log("response: ", res);
      this.filterdPost = res.filter((f: any) => f.postAuthorId === this.userData.uid);
      console.log(this.filterdPost, "hjdjhdshfsdjhhjMSV");

    })
  }
  open(content: any) {
    this.editProfile.patchValue(this.userData)
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
      (result) => {
        console.log(result);

      }
    );
  }
  updateProfile() {
    if (this.editProfile.valid) {
      console.log(this.editProfile.value)
      // this.db.update(this.editProfile)
      let data = {
        ...this.userData,
        ...this.editProfile.value
      }
      console.log(data);
      this.db.updateUserAllData(this.token, data).subscribe(data => {
        this.getUserData()
      });
    }

  }
  //get name
  get name() {
    return this.editProfile.get('name')
  }
  get bio() {
    return this.editProfile.get('bio')
  }
  get phone() {
    return this.editProfile.get('phone')
  }
  get age() {
    return this.editProfile.get('age')
  }
  get location() {
    return this.editProfile.get('location')
  }
  get url() {
    return this.editProfile.get('url')
  }
}
