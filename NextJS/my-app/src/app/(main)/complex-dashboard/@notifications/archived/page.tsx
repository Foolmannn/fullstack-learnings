import React from 'react'
import { Card } from '@/app/components/Card'
import Link from 'next/link'
// SUBNAVIGATIONS   
function Notifications() {
  return (
    <Card>
        <div>
            Archieved Notifications
            </div>
            <Link href='/complex-dashboard'>Default</Link>
            </Card>
  )
}

export default Notifications