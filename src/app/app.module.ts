import { HttpClientModule } from '@angular/common/http';
import { FooterComponent } from './pages/fixed/footer/footer.component';
import { HeaderComponent } from './pages/fixed/header/header.component';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from './environments/environment';
import { SignupComponent } from './pages/signup/signup.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { HomeComponent } from './pages/home/home.component';
import { ToastrModule } from 'ngx-toastr';
import { SidebarComponent } from './pages/fixed/sidebar/sidebar.component';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { EmojiModule } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { SwiperModule } from 'swiper/angular';
import { NgxEmojiPickerModule } from 'ngx-emoji-picker';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { ChatComponent } from './pages/chat/chat.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { SearchComponent } from './pages/search/search.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { MatCardModule } from '@angular/material/card';
import { AngularFireMessagingModule } from '@angular/fire/compat/messaging';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { GroupsComponent } from './pages/groups/groups.component';
import { MatInputModule } from '@angular/material/input';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    ChatComponent,
    ProfileComponent,
    SearchComponent,
    GroupsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    MatInputModule,
    MatCardModule,
    AngularFirestoreModule,
    ServiceWorkerModule.register('firebase-messaging-sw.js', { enabled: environment.production }),
    HttpClientModule,
    Ng2SearchPipeModule,
    AngularFireAuthModule,
    EmojiModule,
    MatFormFieldModule,
    NgxEmojiPickerModule,
    PickerModule,
    AngularFireMessagingModule,
    ReactiveFormsModule,
    NgbCarouselModule,
    MatAutocompleteModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      toastClass: 'toast'
    }),
    SwiperModule,
    TabsModule,
    CommonModule,
    MatSnackBarModule,
    AngularFireMessagingModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebase)
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
