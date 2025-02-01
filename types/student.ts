<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
import { CuisineType, DietaryType, User} from "./index"


=======
<<<<<<< HEAD
=======
>>>>>>> origin/main
=======
import { CuisineType, DietaryType, User} from "./index"


>>>>>>> a6396a4 (Version lOLZ)
<<<<<<< HEAD
>>>>>>> 3be442bcdc62f9e590e91fd40a9f56038d458aa0
=======
>>>>>>> origin/main
=======
import { CuisineType, DietaryType, User} from "./index"


>>>>>>> 071bc5d (v5)
export interface Student extends User {
  college: string
  hostelAddress: string
  preferences: {
    dietaryType: DietaryType[]
    cuisinePreferences: CuisineType[]
  }
  rating: number
  totalOrders: number
}

export interface Rating {
  id: string
  fromId: string
  toId: string
  rating: number
  review: string
  orderId: string
  createdAt: Date
}

export interface BankDetails {
  id: string
  userId: string
  accountHolderName: string
  accountNumber: string
  ifscCode: string
  bankName: string
  isVerified: boolean
}

